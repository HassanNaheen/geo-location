import { Request } from 'express';

export const isLatitude = (num: number) => isFinite(num) && Math.abs(num) <= 90;

export const isLongitude = (num: number) =>
  isFinite(num) && Math.abs(num) <= 180;

function isNumber(str: string) {
  return !isNaN(+str);
}

export const checkRequestParams = (req: Request) => {
  const {
    params: { minLongitude, minLatitude, maxLongitude, maxLatitude },
  } = req;

  const validNumber =
    isNumber(minLatitude) &&
    isNumber(minLongitude) &&
    isNumber(maxLatitude) &&
    isNumber(maxLongitude);

  const validCoOrdinates =
    isLongitude(Number(minLongitude)) &&
    isLatitude(Number(minLatitude)) &&
    isLongitude(Number(maxLongitude)) &&
    isLatitude(Number(maxLatitude));

  if (!validNumber || !validCoOrdinates) {
    throw new Error(
      'min Longitude, min Latitude, max Longitude, max Latitude are required in url params'
    );
  }
};
