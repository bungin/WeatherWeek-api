import { Router, type Request, type Response } from 'express';
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';
const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Received city:', req.body.cityName); // receiving the city name
    const weatherData = await weatherService.getWeatherForCity(req.body.cityName);
    // console.log('Weather data:', weatherData); // Log the weather data
    await historyService.addCity(req.body.cityName);
    res.status(200).json(weatherData); // Sets status to 200 OK and sends JSON response
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message }); // Sets status to 500 Internal Server Error and sends error message
    } else {
      res.status(500).json({ error: 'An unknown error occurred' }); // Handles unknown error type
    }
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await historyService.getCities();
    console.log(cities)
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