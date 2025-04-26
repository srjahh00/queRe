import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

const chartViews = {
    label: "Total usage today",
};

const chartConfig = {
    alessa: {
        label: "Alessa",
        color: "hsl(var(--chart-1))",
    },
    emillia: {
        label: "Emillia",
        color: "hsl(var(--chart-2))",
    },
    linda: {
        label: "Linda",
        color: "hsl(var(--chart-3))",
    },
} satisfies Record<string, { label: string; color: string }>;

export function DailyStatistic({
    sms_per_day_environment,
}: {
    sms_per_day_environment: any;
}) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("alessa");

    const chartData = React.useMemo(() => {
        if (!sms_per_day_environment) return [];

        const formatted = sms_per_day_environment.map((item: any) => {
            const result: any = { date: item.date };
            item.environments.forEach((env: any) => {
                result[env.environment.toLowerCase()] = env.total;
            });
            return result;
        });

        // Sort by date ascending (oldest to newest)
        return formatted.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [sms_per_day_environment]);

    const total = React.useMemo(() => {
        const totals = { alessa: 0, emillia: 0, linda: 0 };
        chartData.forEach((item) => {
            totals.alessa += item.alessa ?? 0;
            totals.emillia += item.emillia ?? 0;
            totals.linda += item.linda ?? 0;
        });
        return totals;
    }, [chartData]);

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>DaisySMS Monitoring</CardTitle>
                    <CardDescription>Showing daily SMS usage</CardDescription>
                </div>
                <div className="flex">
                    {["alessa", "emillia", "linda"].map((key) => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total[chart].toLocaleString()}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        data={chartData}
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
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey={activeChart}
                            fill={
                                chartConfig[activeChart]?.color ??
                                "hsl(var(--chart-1))"
                            } // default color fallback
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
