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

  async findByQuery(query: any) {
    const mongoQuery: FilterQuery<LocationDocument> = {};

    // If the 'type' is part of top-level document (likely "Feature")
    if (query.type) {
      mongoQuery.type = query.type;
    }

    // Treat everything else as a property inside `properties`
    for (const key in query) {
      if (key !== 'type') {
        mongoQuery[`properties.${key}`] = query[key];
      }
    }

    return this.locationModel.find(mongoQuery);
  }

}
