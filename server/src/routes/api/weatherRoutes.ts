import { Router, type Request, type Response } from 'express';
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';
const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Received city:', req.body.cityName);
    const currentWeather  = await weatherService.getWeatherForCity(req.body.cityName);
    await historyService.addCity(req.body.cityName);
    res.status(200).json(currentWeather); 
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await historyService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    await historyService.removeCity(req.params.id);
    res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;