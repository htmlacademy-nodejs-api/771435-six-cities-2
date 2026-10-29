import {MockServerData, User} from '../../types/index.js';
import {generateRandomValue, getRandomItem, getRandomItems} from '../../helpers/index.js';
import dayjs from 'dayjs';
import {City} from '../../types/city.type.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_PRICE = 500;
const MAX_PRICE = 2000;

export class TsvOfferGenerate {
  constructor(private readonly mockData: MockServerData) {}

  public generate() {
    const name = getRandomItem<string>(this.mockData.name);
    const description = getRandomItem<string>(this.mockData.description);
    const date = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const cityObj = getRandomItem<City>(this.mockData.city);
    const city = `${cityObj.name};${cityObj.coordinates?.latitude};${cityObj.coordinates?.longitude}`;
    const previewImage = getRandomItem<string>(this.mockData.previewImage);
    const images = getRandomItems<string>(this.mockData.images).join(';');
    const isPremium = !!generateRandomValue(0, 1);
    const isFavourite = !!generateRandomValue(0, 1);
    const rating = generateRandomValue(0, 5);
    const type = getRandomItem<string>(this.mockData.type);
    const roomQty = generateRandomValue(1, 3);
    const guestQty = generateRandomValue(1, 3);
    const count = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const amenities = getRandomItems<string>(this.mockData.amenities).join(';');
    const authorObj = getRandomItem<User>(this.mockData.author);
    const author = `${authorObj.name};${authorObj.email};${authorObj.avatar};${authorObj.password};${authorObj.type}`;
    const commentQty = generateRandomValue(1, 7);
    const coordinates:string = `${cityObj.coordinates?.latitude};${cityObj.coordinates?.longitude}`;

    return [name, description, date, city, previewImage, images, isPremium, isFavourite, rating, type, roomQty, guestQty, count, amenities, author, commentQty, coordinates].join('\t');
  }
}
