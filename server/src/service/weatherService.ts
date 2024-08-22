import dotenv from 'dotenv';
import { response } from 'express';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  private temp: number;
  private wind: number;
  private humidity: number;

  constructor(temp: number, wind: number, humidity: number) {
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private APIkey: string; //appid
  private cityName: string;
  private lat: number;
  private lon: number; // needed? defined in coordinates as well.

  constructor(baseURL: string, APIkey: string, cityName: string, lat: number, lon: number) {
    this.baseURL = baseURL;
    this.APIkey = APIkey;
    this.cityName = cityName;
    this.lat = lat;
    this.lon = lon;
  }
  // TODO: Create fetchLocationData method

  private async fetchLocationData(query: string) {
    const url = `https:api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=${this.APIkey}`
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
