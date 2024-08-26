import fs from 'node:fs/promises'
import {v4} from 'uuid'

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {  //help from ian
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.readFile('./db/db.json', {encoding: 'utf8'})
    return JSON.parse(data) || [];

  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('./db/db.json', JSON.stringify(cities));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read() || [];
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
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
