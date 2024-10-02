import { indicatorActions } from "@/apiRequest/indicator/indicatorActions";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetIndicatorDashboard = (
  params: DashboardIndicatorQueryParamsType
) =>
  useQuery({
    queryKey: [QUERY_KEYS.INDICATORS, params],
    queryFn: () => indicatorActions.get(params),
  });
