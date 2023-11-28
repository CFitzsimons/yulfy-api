import Express from 'express';

const health = (req: Express.Request, res: Express.Response) => {
  console.log('HERE');
  res.send({ ok: true });
};

export default { health };