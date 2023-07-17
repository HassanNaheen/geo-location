import axios from 'axios';
import { Request, Response } from 'express';
import osmdtogeojson, { OsmToGeoJSONOptions } from 'osmtogeojson';
import { FeatureCollection, GeometryObject } from 'geojson';

import getGeoLocationToJson from './get-geo-location-to-json';
import {
  checkRequestParams,
  isLatitude,
  isLongitude,
} from './check-request-params';

// Mock the required objects/functions
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const geojson: FeatureCollection<GeometryObject> = {
  type: 'FeatureCollection',
  features: [],
};
jest.mock('osmtogeojson', () => {
  return {
    __esModule: true,
    default: jest
      .fn()
      .mockImplementation((data: any, options?: OsmToGeoJSONOptions) => {
        return geojson;
      }),
  };
});

describe('getGeoLocationToJson', () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = { params: {} } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it('should call checkRequestParams and axios.get with the correct URL', async () => {
    const mockResponseData = {
      data: {},
    };
    const osmMockedGeoRes = {
      data: {},
    };

    // Mocking the successful axios.get call
    mockedAxios.get.mockResolvedValue({ data: mockResponseData });

    // Set request parameters
    req.params.minLongitude = '10';
    req.params.minLatitude = '20';
    req.params.maxLongitude = '30';
    req.params.maxLatitude = '40';

    // Call the function to test
    const aa = await getGeoLocationToJson(req, res, next);

    //expect(checkRequestParams).toHaveBeenCalledWith(req);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.openstreetmap.org/api/0.6/map?bbox=10,20,30,40'
    );
    expect(osmdtogeojson).toHaveBeenCalledWith(mockResponseData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(geojson);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('isLatitude', () => {
  it('should return true for a valid latitude', () => {
    expect(isLatitude(40)).toBe(true);
  });

  it('should return false for an invalid latitude', () => {
    expect(isLatitude(100)).toBe(false);
  });
});

describe('isLongitude', () => {
  it('should return true for a valid longitude', () => {
    expect(isLongitude(-80)).toBe(true);
  });

  it('should return false for an invalid longitude', () => {
    expect(isLongitude(200)).toBe(false);
  });
});

describe('checkRequestParams', () => {
  let req: Request;

  beforeEach(() => {
    req = { params: {} } as Request;
  });

  it('should throw an error if any of the parameters is missing or invalid', () => {
    // Set invalid request parameters
    req.params.minLongitude = 'abc';
    req.params.minLatitude = '20';
    req.params.maxLongitude = '30';
    req.params.maxLatitude = '40';

    expect(() => checkRequestParams(req)).toThrowError(
      'min Longitude, min Latitude, max Longitude, max Latitude are required in url params'
    );
  });

  it('should not throw an error if all parameters are valid', () => {
    // Set valid request parameters
    req.params.minLongitude = '10';
    req.params.minLatitude = '20';
    req.params.maxLongitude = '30';
    req.params.maxLatitude = '40';

    expect(() => checkRequestParams(req)).not.toThrow();
  });
});
