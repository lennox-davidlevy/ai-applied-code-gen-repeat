import express from 'express';
import configRouter from './configRoutes';
import dbRouter from './dbRoutes';
import petNamerRouter from './petNamerRoutes'

const router = express.Router();

router.use('/api', configRouter);
router.use('/api/db', dbRouter);
router.use('/api/pet_namer', petNamerRouter)

export default router;
