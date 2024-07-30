import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// A route to pass env variables to the browser when deployed

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).send({ message: 'server up' });
});

// In this case we send back the API_PROXY value to the UI to connect to the websocket
router.get('/config', (_req: Request, res: Response) => {
  res.status(200).send({
    API_PROXY: process.env.API_PROXY,
  });
});

export default router;
