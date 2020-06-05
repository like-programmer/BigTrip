import {FilterType} from "../const.js";
import {isPastPoint, isFuturePoint} from "./common.js";

export const getPastPoints = (points, date) => {
  return points.filter((point) => isPastPoint(point.dateTo, date));
};

export const getFuturePoints = (points, date) => {
  return points.filter((point) => isFuturePoint(point.dateFrom, date));
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
  }

  return points;
};
