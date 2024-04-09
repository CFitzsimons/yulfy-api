import assert from 'node:assert';
import test, { before, beforeEach, describe, mock } from 'node:test';
import { mockRequest, mockResponse } from 'mock-req-res';
import {
  getEventFunction,
  hashPlainToken,
} from '../../src/controllers/zoom/event-handlers';
import controller from '../../src/controllers/zoom/zoom';
import { EventType } from '../../src/types/event.type';
import storage from '../../src/util/storage';
import { ZodError } from 'zod';

const getMockedReqRes = (body: any) => {
  const req = mockRequest({ body });
  const res = mockResponse();
  return { req, res };
};

describe('Zoom', () => {
  let map = new Map();
  before(() => {
    storage.read = () => map;
    storage.write = newMap => {
      map = newMap;
    };
  });
  describe('Basic handler validation', () => {
    test('should get validator', () => {
      const validation = getEventFunction(EventType.ENDPOINT_VALIDATION);
      assert.equal('function', typeof validation);
    });

    test('should get presence updater', () => {
      const presenceUpdate = getEventFunction(EventType.USER_PRESENCE_UPDATE);
      assert.equal('function', typeof presenceUpdate);
    });

    test('should throw error if eventype does not exist', () => {
      const invalidEvent = 'SOME_RANDOM_EVENT' as EventType;
      try {
        getEventFunction(invalidEvent);
        assert.fail('Error not thrown, was expected to be thrown.');
      } catch (err: any) {
        if (err instanceof Error) {
          assert.equal(err.message, `${invalidEvent} is not a defined event.`);
        }
      }
    });
  });

  describe('Presence updater', () => {
    test('should update to different statuses', () => {
      const email = 'test@test.com';
      const payload = {
        object: {
          email,
          presence_status: 'Available',
          date_time: new Date().toISOString(),
          id: '123456789',
        },
      };
      const { req, res } = getMockedReqRes({ payload });
      const presenceUpdate = getEventFunction(EventType.USER_PRESENCE_UPDATE);
      assert.equal(map.get(email), undefined);
      presenceUpdate(req, res);
      assert.equal(map.get(email), 'Available');
    });

    test('should fail to update to invalid status', () => {
      const email = 'test1@test.com';
      const payload = {
        object: {
          email,
          presence_status: 'NOT VALID',
          date_time: new Date().toISOString(),
          id: '123456789',
        },
      };
      const { req, res } = getMockedReqRes({ payload });
      const presenceUpdate = getEventFunction(EventType.USER_PRESENCE_UPDATE);
      assert.equal(map.get(email), undefined);
      try {
        presenceUpdate(req, res);
        assert.fail('Error not thrown, was expected to be thrown.');
      } catch (err) {
        if (err instanceof ZodError) {
          assert(err.message.includes('Invalid enum value.'));
        }
      }
    });
  });

  describe('Validation', () => {
    const plainToken = 'KNOWN_PLAIN_TOKEN';
    const validationToken = 'KNOWN_VERIFICATION_TOKEN';
    const expectedResult =
      '0a6de39bd916455a50cfed32650bfee940b0b2a269ac46b9bb540febb492b718';
    const payload = {
      plainToken,
    };

    beforeEach(() => {
      process.env.ZOOM_VERIFICATION_TOKEN = validationToken;
    });

    test('should return correct hash', () => {
      const actualResult = hashPlainToken(plainToken, validationToken);
      assert.equal(actualResult, expectedResult);
    });

    test('should respond with valid token', () => {
      const validation = getEventFunction(EventType.ENDPOINT_VALIDATION);
      const { req, res } = getMockedReqRes({ payload });
      validation(req, res);
      assert(
        res.send.calledOnceWith({ plainToken, encryptedToken: expectedResult })
      );
    });

    test('should fail if env variable is not defined', () => {
      delete process.env.ZOOM_VERIFICATION_TOKEN;
      const validation = getEventFunction(EventType.ENDPOINT_VALIDATION);
      const { req, res } = getMockedReqRes({ payload });
      validation(req, res);
      assert(res.status.calledOnceWith(500));
    });
  });

  describe('Controllers', () => {
    test('/zoom/get - should get valid status', () => {
      const knownEmail = 'zoomget@test.com';
      const validMap = new Map();
      validMap.set(knownEmail, 'Available');
      storage.write(validMap);
      const payload = {
        email: knownEmail,
      };
      const { req, res } = getMockedReqRes(payload);
      controller.get(req, res);
      assert(res.send.calledOnceWith('Available'));
    });

    test('/zoom/get - should fail if email is not provided', () => {
      const payload = {};
      const { req, res } = getMockedReqRes(payload);
      controller.get(req, res);
      assert(res.status.calledOnceWith(400));
      assert(res.send.calledOnceWith('Email is a required field.'));
    });

    test('/zoom/get - should fail if status is not registered', () => {
      const payload = {
        email: 'incorrectEmail@test.com',
      };
      const { req, res } = getMockedReqRes(payload);
      controller.get(req, res);
      assert(res.status.calledOnceWith(400));
      assert(
        res.send.calledOnceWith(
          'Email does not have a status, probably not subscribed.'
        )
      );
    });
  });
});
