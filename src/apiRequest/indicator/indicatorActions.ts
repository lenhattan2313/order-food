import { PREFIX_URL } from '@/constants/url';
import http from '@/lib/httpUtils';
import {
  DashboardIndicatorQueryParamsType,
  DashboardIndicatorResType,
} from '@/schemaValidations/indicator.schema';
import queryString from 'query-string';

export const indicatorActions = {
  get: (params: DashboardIndicatorQueryParamsType) =>
    http.get<DashboardIndicatorResType>(
      `${PREFIX_URL.INDICATOR}/dashboard?${queryString.stringify(
        params
          ? {
              fromDate: params.fromDate?.toJSON() ?? '',
              toDate: params.toDate?.toJSON() ?? '',
            }
          : {},
      )}`,
    ),
};
