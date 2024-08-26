import dotenv from 'dotenv';

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
 temp: string;
 wind: string;
 humidity: string;
 icon: string;
 description: string;
}

class WeatherService {
  private baseURL: string;
  private APIkey: string; //appid
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
    // console.log('lat', lat, 'lon', lon); //coords work
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.APIkey}`;
    
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
    // console.log('main temp',response.list[0].main.temp);
    const wind = response.list[0].wind.speed;
    // console.log('wind speed',response.list[0].wind.speed);
    const humidity = response.list[0].main.humidity;
    // const city = response.list.name;
    const icon = response.list[0].weather[0].icon;
    const description = response.list[0].weather[0].description;
    console.log('main humidity', response.list[0]);
    // console.log('parsecurrentweather this.cityname', this.cityName); //still good
    return {temp, wind, humidity, icon, description};
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      const temp = data.main.temp;
      const wind = data.wind.speed;
      const humidity = data.main.humidity;
      const icon = data.weather.icon;
      const description = data.weather.description;
      return {temp, wind, humidity, icon, description};
    });
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
    // console.log('currentWeather getweatherforcity', currentWeather); //still good here, despite what browser console states
    // console.log('forecastArray getweatherforcity', forecastArray); // good
    // console.log({...currentWeather})
    return { currentWeather, forecastArray };
  }
}
dotenv.config();
export default new WeatherService('https://api.openweathermap.org', `${process.env.API_KEY}`, ''); //i think empty string is more appropriate?