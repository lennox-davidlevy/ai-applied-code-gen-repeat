import express from 'express';
import configRouter from './configRoutes';
import dbRouter from './dbRoutes';

const router = express.Router();

router.use('/api', configRouter);
router.use('/api/db', dbRouter);

export default router;
