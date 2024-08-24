import { Router, type Request, type Response } from 'express';
const router = Router();
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

router.post('/', async (req: Request, res: Response) => {
  try {
    const weatherData = await weatherService.getWeatherForCity(req.body.city);
    await historyService.addCity(req.body.city);
    res.status(200).json(weatherData); // Sets status to 200 OK and sends JSON response
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message }); // Sets status to 500 Internal Server Error and sends error message
    } else {
      res.status(500).json({ error: 'An unknown error occurred' }); // Handles unknown error type
    }
  }
});

router.get('/history', async (res: Response) => {
  try {
    const cities = await historyService.getCities();
    res.status(200).json(cities); // Sets status to 200 OK and sends JSON response
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message }); // Sets status to 500 Internal Server Error and sends error message
    } else {
      res.status(500).json({ error: 'An unknown error occurred' }); // Handles unknown error type
    }
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    await historyService.removeCity(req.params.id);
    res.status(200).json({ message: 'City removed from history' }); // Sets status to 200 OK and sends success message
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message }); // Sets status to 500 Internal Server Error and sends error message
    } else {
      res.status(500).json({ error: 'An unknown error occurred' }); // Handles unknown error type
    }
  }
});

export default router;