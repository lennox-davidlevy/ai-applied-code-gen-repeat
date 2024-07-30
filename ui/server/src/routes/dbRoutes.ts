import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// A route for your UI's database

router.get('/', async (_req: Request, res: Response) => {
  try {
    res.status(200).send({ message: 'db route working' });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
