import { RequestHandler, Request, Response } from 'express';
import axios from 'axios';
import osmdtogeojson from 'osmtogeojson';
import { checkRequestParams } from './check-request-params';

const baseUrl = 'https://api.openstreetmap.org/api/0.6/map?bbox=';

const getGeoLocationToJson: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    checkRequestParams(req);

    const {
      params: { minLongitude, minLatitude, maxLongitude, maxLatitude },
    } = req;

    const url = `${baseUrl}${minLongitude},${minLatitude},${maxLongitude},${maxLatitude}`;

    const response = await axios.get(url);
    const osmGeoRes = osmdtogeojson(response.data);
    res.status(200).json(osmGeoRes);
  } catch (error) {
    next(error);
  }
};

export default getGeoLocationToJson;
