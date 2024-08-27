import dotenv from 'dotenv';

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
 temp: string;
 wind: string;
 humidity: string;
 city: string;
 date: string;
 icon: string;
 iconDescription: string;
}

class WeatherService {
  private baseURL: string;
  private APIkey: string;
  private cityName: string;
  
  constructor(baseURL: string, APIkey: string, cityName: string) {
    this.baseURL = baseURL;
    this.APIkey = APIkey;
    this.cityName = cityName;
  }
  
  private buildGeocodeQuery(cityName: string, APIkey: string): string {
    const baseURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIkey}`;
    return baseURL;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.APIkey}&units=imperial`;
    
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates | null> {
    const url = this.buildGeocodeQuery(this.cityName, this.APIkey);
 
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
  
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      }
      throw new Error('Invalid location data');
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    const url = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  private parseCurrentWeather(response: any): Weather {

    const temp = response.list[0].main.temp;
    const wind = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;
    const city = response.city.name;
    const icon = response.list[0].weather[0].icon;
    const iconDescription = response.list[0].weather[0].description;
    const date = new Date().toLocaleDateString();
    return {temp, wind, humidity, city, date, icon, iconDescription};
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    const forecastArray = [];
    for (let i = 0; i < weatherData.length; i+=8) {
      const temp = weatherData[i].main.temp;
      const wind = weatherData[i].wind.speed;
      const humidity = weatherData[i].main.humidity;
      const city = this.cityName;
      const icon = weatherData[i].weather[0].icon;
      const iconDescription = weatherData[i].weather[0].description;
      const date = new Date(weatherData[i].dt * 1000).toLocaleDateString();
      forecastArray.push({temp, wind, humidity, city, date, icon, iconDescription});
    }
    

    return forecastArray;
  }

  public async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    if (!coordinates) {
      throw new Error('Failed to fetch location data');
    }

    const weatherData = await this.fetchWeatherData(coordinates);
    if (!weatherData) {
      throw new Error('Failed to fetch weather data');
    }

    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData.list);

    return { currentWeather, forecastArray };
  }
}
dotenv.config();
export default new WeatherService('https://api.openweathermap.org', `${process.env.API_KEY}`, '');