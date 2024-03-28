import Express from 'express';

const listen = (req: Express.Request, res: Express.Response) => {
  console.log(req.body);
  res.send('Ok');
};

const get = (req: Express.Request, res: Express.Response) => {

};

export default { get, listen };