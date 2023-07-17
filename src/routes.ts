import geGeotLocationToJson from './get-geo-location-to-json';
import express from 'express';

const router = express.Router();

// call api geo location to json
router.get(
  '/geo-location/:minLongitude/:minLatitude/:maxLongitude/:maxLatitude',
  geGeotLocationToJson
);

export default router;
