import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const API_URL: string = process.env.API_URL || '';

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).send({ message: 'generate_pet_name Route Up!' });
});

router.post('/generate_pet_name', async (req: Request, res: Response) => {
  const { data } = req.body;
  try {
    const body = {
      llm_name: 'pet_namer',
      prompt_template_name: 'pet_namer',
      prompt_template_kwargs: {
        data: data,
      },
    };
    const result = await axios.post(`${API_URL}/generate_pet_name`, body);
    return res.status(200).send({
      generated_text: result.data.generated_text,
      request_sent_to_llm: body,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err });
  }
});

export default router;
