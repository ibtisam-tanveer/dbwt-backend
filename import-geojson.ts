import { connect, model, Schema } from 'mongoose';
import * as fs from 'fs';

interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: Record<string, any>;
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

const LocationSchema = new Schema({
  type: { type: String, required: true },
  geometry: {
    type: { type: String, required: true },
    coordinates: { type: Array, required: true },
  },
  properties: { type: Object, required: true },
  address: {
    country: String,
    housenumber: String,
    postcode: String,
    street: String,
    city: String,
    suburb: String,
    housename: String
  }
});

const Location = model('Location', LocationSchema);

function transformAddress(properties: Record<string, any>) {
  const address: any = {};
  
  // Map address fields from properties to address object
  if (properties['addr:country']) address.country = properties['addr:country'];
  if (properties['addr:housenumber']) address.housenumber = properties['addr:housenumber'];
  if (properties['addr:postcode']) address.postcode = properties['addr:postcode'];
  if (properties['addr:street']) address.street = properties['addr:street'];
  if (properties['addr:city']) address.city = properties['addr:city'];
  if (properties['addr:suburb']) address.suburb = properties['addr:suburb'];
  if (properties['addr:housename']) address.housename = properties['addr:housename'];

  // Remove address fields from properties
  const newProperties = { ...properties };
  delete newProperties['addr:country'];
  delete newProperties['addr:housenumber'];
  delete newProperties['addr:postcode'];
  delete newProperties['addr:street'];
  delete newProperties['addr:city'];
  delete newProperties['addr:suburb'];
  delete newProperties['addr:housename'];

  return { address, properties: newProperties };
}

async function run() {
  await connect(process.env.MONGO_URI || 'mongodb+srv://ibtisamtanveer22:s3uBy6p6UAEcPteb@dbwt-backend.yzwu2zk.mongodb.net/');
  const data = JSON.parse(fs.readFileSync('./chemnitz.geojson', 'utf8')) as GeoJSONData;
  
  // Transform the data to include the new address structure
  const transformedFeatures = data.features.map(feature => {
    const { address, properties } = transformAddress(feature.properties);
    return {
      ...feature,
      properties,
      address
    };
  });

  await Location.insertMany(transformedFeatures);
  console.log('GeoJSON data imported with new address structure!');
  process.exit(0);
}

run().catch(console.error); 