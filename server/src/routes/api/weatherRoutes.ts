import { Router, type Request, type Response } from 'express';
const router = Router();
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  weatherService.getWeatherForCity(req.body.city);
  historyService.addCity(req.body.city);
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  historyService.getCities();
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  historyService.removeCity(req.params.id);
});

export default router;
