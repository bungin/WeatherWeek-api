import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';

router.use('/weather', weatherRoutes); ///weather is base subdir/suburl. 

export default router;
