import fs from 'node:fs/promises'
import {v4} from 'uuid'


class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {  //help from ian

  private async read() {
    const data = await fs.readFile('./db/db.json', {encoding: 'utf8'})
    return JSON.parse(data) || [];

  }

  private async write(cities: City[]) {
    return await fs.writeFile('./db/db.json', JSON.stringify(cities));
  }
 
  async getCities() {
    return await this.read() || [];
  }

  async addCity(city: string) {
    const toUpdate = await this.getCities();
    console.log(toUpdate);
    const newCity = {
      name: city,
      id: v4(),
    }
    toUpdate.push(newCity);
    console.log('cities: ', toUpdate)
    this.write(toUpdate);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const toUpdate = await this.getCities();
    const cities = JSON.parse(toUpdate as string);
    const updatedCities = cities.filter((city: City) => city.id !== id);
    this.write(updatedCities);
  }
}

export default new HistoryService();
