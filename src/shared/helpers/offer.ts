import {OfferType} from '../types/offer-types.type.js';
import {Amenity} from '../types/amenity.type.js';
import {Offer} from '../types/index.js';
import {City} from '../types/city.type.js';
import {UserTypes} from '../types/user-types.type.js';

export function createOffer(offerData: string): Offer {
  const [
    name,
    description,
    date,
    city,
    previewImage,
    images,
    isPremium,
    isFavourite,
    rating,
    type,
    roomQty,
    guestQty,
    count,
    amenities,
    author,
    commentsQty] = offerData.replace('\n', '').split('\t');

  const [cityName, lat, lng] = city.split(';');
  const formatCity:City = {
    name: cityName,
    coordinates: {
      latitude: lat,
      longitude: lng,
    },
  };

  const [authorName, email, avatar, password, authorType] = author.split(';');

  return {
    name,
    description,
    date,
    city: formatCity,
    previewImage,
    images: images.split(';'),
    isPremium: isPremium === 'true',
    isFavourite: isFavourite === 'true',
    rating: Number.parseFloat(rating),
    type: type as OfferType,
    roomQty: Number.parseInt(roomQty, 10),
    guestQty: Number.parseInt(guestQty, 10),
    count: Number.parseInt(count, 10),
    amenities: amenities.split(';') as Amenity[],
    author: {
      name: authorName,
      email,
      avatar,
      password,
      type: authorType as UserTypes,
    },
    commentsQty: Number.parseInt(commentsQty, 10),
    coordinates: {
      latitude: lat,
      longitude: lng,
    },
  };
}
