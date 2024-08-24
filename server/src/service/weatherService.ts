interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  private temp: number;
  private wind: number;
  private humidity: number;

  constructor(temp: number, wind: number, humidity: number) {
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
  }
  public getTemp(): number {
    return this.temp;
  }

  public getWind(): number {
    return this.wind;
  }

  public getHumidity(): number {
    return this.humidity;
  }
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

  private buildGeocodeQuery(city: string, APIkey: string): string {
    const baseURL = 'https://api.openweathermap.org/geo/1.0/direct';
    const params = new URLSearchParams({
      query: city,
      APIkey: APIkey
    });
  
    return `${baseURL}?${params.toString()}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
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
    const wind = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;
    return new Weather(temp, wind, humidity);
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      const temp = data.main.temp;
      const wind = data.wind.speed;
      const humidity = data.main.humidity;
      return new Weather(temp, wind, humidity);
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

    return { currentWeather, forecastArray };
  }
}

export default new WeatherService('https://api.openweathermap.org', 'YOUR_API_KEY', 'YOUR_CITY_NAME');