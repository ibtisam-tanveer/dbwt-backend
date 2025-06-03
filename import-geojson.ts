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
  features: GeoJSONFeature[];
}

const LocationSchema = new Schema({
  type: { type: String, required: true },
  geometry: {
    type: { type: String, required: true },
    coordinates: { type: Array, required: true },
  },
  properties: { type: Object, required: true },
});

const Location = model('Location', LocationSchema);

async function run() {
  await connect(process.env.MONGO_URI || 'mongodb+srv://ibtisamtanveer22:s3uBy6p6UAEcPteb@dbwt-backend.yzwu2zk.mongodb.net/');
  const data = JSON.parse(fs.readFileSync('./chemnitz.geojson', 'utf8')) as GeoJSONData;
  await Location.insertMany(data.features);
  console.log('GeoJSON data imported!');
  process.exit(0);
}

run(); 