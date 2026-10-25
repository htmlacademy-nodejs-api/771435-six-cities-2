import {City} from './city.type.js';
import {User} from './user.type.js';

export interface MockServerData {
  name: string[],
  description: string[],
  city: City[],
  previewImage: string[],
  images: string[],
  type: string[],
  amenities: string[],
  author: User[],
}
