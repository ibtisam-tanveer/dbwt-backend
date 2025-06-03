// src/location/location.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model } from 'mongoose';
import { Location, LocationDocument } from './location.schema';

@Injectable()
export class LocationService {

  constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) { }


  async findAll() {
    return this.locationModel.find(); // limit for performance
  }

  async findById(id: string) {
    return this.locationModel.findById(id);
  }

  // async findByQuery(query: any) {
  //   const mongoQuery: FilterQuery<LocationDocument> = {};

  //   // If the 'type' is part of top-level document (likely "Feature")
  //   if (query.type) {
  //     mongoQuery.type = query.type;
  //   }

  //   // Treat everything else as a property inside `properties`
  //   for (const key in query) {
  //     if (key !== 'type') {
  //       mongoQuery[`properties.${key}`] = query[key];
  //     }
  //   }

  //   return this.locationModel.find(mongoQuery);
  // }

  // async findByQuery(query: any): Promise<Location[]> {
  //   const mongoQuery: any = {};
  
  //   for (const [key, value] of Object.entries(query)) {
  //     // If the key matches any address field, prefix with 'address.'
  //     if (["country", "housenumber", "postcode", "street", "city", "housename"].includes(key)) {
  //       mongoQuery[`address.${key}`] = value;
  //     } else {
  //       mongoQuery[key] = value; // direct field like amenity, name, etc.
  //     }
  //   }
  
  //   return this.locationModel.find(mongoQuery).exec();
  // }
  
 
  async findByQuery(query: any): Promise<LocationDocument[]> {
    const mongoQuery: FilterQuery<LocationDocument> = {};
  
    const addressFields = ['country', 'housenumber', 'postcode', 'street', 'city', 'housename'];
    const topLevelFields = ['type']; // Add others if needed
  
    for (const [key, value] of Object.entries(query)) {
      const regex = new RegExp(value as string, 'i'); // case-insensitive
  
      if (topLevelFields.includes(key)) {
        mongoQuery[key] = regex;
      } else if (addressFields.includes(key)) {
        mongoQuery[`address.${key}`] = regex;
      } else {
        mongoQuery[`properties.${key}`] = regex;
      }
    }
  
    return this.locationModel.find(mongoQuery).exec();
  }
  
}
