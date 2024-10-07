'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DashboardIndicatorResType } from '@/schemaValidations/indicator.schema';
import { format, parse } from 'date-fns';
import { useTranslations } from 'next-intl';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function RevenueLineChart({
  revenueByDate,
}: {
  revenueByDate: DashboardIndicatorResType['data']['revenueByDate'];
}) {
  const t = useTranslations('dashboard');
  return (
    <Card data-testid="revenue-chart">
      <CardHeader>
        <CardTitle>{t('revenue')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={revenueByDate}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (revenueByDate.length < 8) {
                  return value;
                }
                if (revenueByDate.length < 33) {
                  const date = parse(value, 'dd/MM/yyyy', new Date());
                  return format(date, 'dd');
                }
                return '';
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Line
              dataKey="revenue"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
