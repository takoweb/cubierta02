import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, LineChart, PieChart, Calendar } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  fetchAnalyticsData,
  AnalyticsData as AnalyticsDataType,
} from "../services/analyticsService";

// Using the type from analyticsService

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType>({
    timeChunks: {
      lunch: 0,
      afternoon: 0,
      dinner: 0,
      other: 0,
    },
    dailyViews: [],
    weeklyViews: [],
    monthlyViews: [],
    popularDishes: [],
    yearlyData: {},
  });

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  const renderTimeChunkBar = (
    label: string,
    value: number,
    maxValue: number,
  ) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-medium">{value} 閲覧数</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderViewsChart = (data: number[]) => {
    const maxValue = Math.max(...data);
    return (
      <div className="flex items-end h-40 gap-1 mt-4">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-primary rounded-t"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs mt-1">{index + 1}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPopularDishes = () => {
    return (
      <div className="space-y-4 mt-4">
        {analyticsData.popularDishes.map((dish, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm">{dish.name}</span>
            <span className="text-sm font-medium">{dish.views} 閲覧数</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-6">分析ダッシュボード</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">総閲覧数</CardTitle>
            <CardDescription>過去30日間</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analyticsData.monthlyViews.reduce((a, b) => a + b, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">ピーク時間</CardTitle>
            <CardDescription>最もアクティブな時間帯</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Object.entries(analyticsData.timeChunks).reduce((a, b) =>
                a[1] > b[1] ? a : b,
              )[0] === "lunch"
                ? "11:00 - 14:00"
                : Object.entries(analyticsData.timeChunks).reduce((a, b) =>
                      a[1] > b[1] ? a : b,
                    )[0] === "afternoon"
                  ? "14:00 - 18:00"
                  : "18:00 - 23:00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">最も閲覧された</CardTitle>
            <CardDescription>人気の料理</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analyticsData.popularDishes[0]?.name || "データなし"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>時間分布</CardTitle>
            <Tabs defaultValue="current" className="mt-2">
              <TabsList>
                <TabsTrigger
                  value="current"
                  className="flex items-center gap-1"
                >
                  <BarChart size={14} />
                  現在
                </TabsTrigger>
                <TabsTrigger value="yearly" className="flex items-center gap-1">
                  <Calendar size={14} />
                  年間
                </TabsTrigger>
              </TabsList>
              <TabsContent value="current">
                <CardDescription>
                  時間帯別の閲覧数 (11:00-14:00, 14:00-18:00, 18:00-23:00)
                </CardDescription>
                <div className="mt-4">
                  {renderTimeChunkBar(
                    "ランチ (11:00-14:00)",
                    analyticsData.timeChunks.lunch,
                    Math.max(
                      analyticsData.timeChunks.lunch,
                      analyticsData.timeChunks.afternoon,
                      analyticsData.timeChunks.dinner,
                      analyticsData.timeChunks.other,
                    ),
                  )}
                  {renderTimeChunkBar(
                    "午後 (14:00-18:00)",
                    analyticsData.timeChunks.afternoon,
                    Math.max(
                      analyticsData.timeChunks.lunch,
                      analyticsData.timeChunks.afternoon,
                      analyticsData.timeChunks.dinner,
                      analyticsData.timeChunks.other,
                    ),
                  )}
                  {renderTimeChunkBar(
                    "ディナー (18:00-23:00)",
                    analyticsData.timeChunks.dinner,
                    Math.max(
                      analyticsData.timeChunks.lunch,
                      analyticsData.timeChunks.afternoon,
                      analyticsData.timeChunks.dinner,
                      analyticsData.timeChunks.other,
                    ),
                  )}
                  {renderTimeChunkBar(
                    "その他の時間",
                    analyticsData.timeChunks.other,
                    Math.max(
                      analyticsData.timeChunks.lunch,
                      analyticsData.timeChunks.afternoon,
                      analyticsData.timeChunks.dinner,
                      analyticsData.timeChunks.other,
                    ),
                  )}
                </div>
              </TabsContent>
              <TabsContent value="yearly">
                <CardDescription>特定の年と月の時間帯別閲覧数</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="year-select" className="mb-2 block text-sm">
                      年
                    </Label>
                    <select
                      id="year-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full h-10 px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="month-select"
                      className="mb-2 block text-sm"
                    >
                      月
                    </Label>
                    <select
                      id="month-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full h-10 px-3 py-2 border rounded-md text-sm"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => (
                          <option key={month} value={month.toString()}>
                            {new Date(2000, month - 1, 1).toLocaleString(
                              "default",
                              { month: "long" },
                            )}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                {analyticsData.yearlyData[selectedYear] &&
                analyticsData.yearlyData[selectedYear][selectedMonth] ? (
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      {new Date(
                        parseInt(selectedYear),
                        parseInt(selectedMonth) - 1,
                        1,
                      ).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    {renderTimeChunkBar(
                      "ランチ (11:00-14:00)",
                      analyticsData.yearlyData[selectedYear][selectedMonth]
                        .lunch,
                      Math.max(
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .lunch,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .afternoon,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .dinner,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .other,
                      ),
                    )}
                    {renderTimeChunkBar(
                      "午後 (14:00-18:00)",
                      analyticsData.yearlyData[selectedYear][selectedMonth]
                        .afternoon,
                      Math.max(
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .lunch,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .afternoon,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .dinner,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .other,
                      ),
                    )}
                    {renderTimeChunkBar(
                      "ディナー (18:00-23:00)",
                      analyticsData.yearlyData[selectedYear][selectedMonth]
                        .dinner,
                      Math.max(
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .lunch,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .afternoon,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .dinner,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .other,
                      ),
                    )}
                    {renderTimeChunkBar(
                      "その他の時間",
                      analyticsData.yearlyData[selectedYear][selectedMonth]
                        .other,
                      Math.max(
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .lunch,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .afternoon,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .dinner,
                        analyticsData.yearlyData[selectedYear][selectedMonth]
                          .other,
                      ),
                    )}
                    <div className="mt-4 text-sm text-gray-500">
                      総閲覧数：{" "}
                      {Object.values(
                        analyticsData.yearlyData[selectedYear][selectedMonth],
                      ).reduce((sum, val) => sum + val, 0)}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    この期間のデータはありません
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>時間経過による閲覧数</CardTitle>
            <Tabs defaultValue="daily" className="mt-2">
              <TabsList>
                <TabsTrigger value="daily" className="flex items-center gap-1">
                  <BarChart size={14} />
                  日次
                </TabsTrigger>
                <TabsTrigger value="weekly" className="flex items-center gap-1">
                  <LineChart size={14} />
                  週次
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="flex items-center gap-1"
                >
                  <PieChart size={14} />
                  月次
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <CardDescription>過去7日間</CardDescription>
                {renderViewsChart(analyticsData.dailyViews)}
              </TabsContent>
              <TabsContent value="weekly">
                <CardDescription>過去5週間</CardDescription>
                {renderViewsChart(analyticsData.weeklyViews)}
              </TabsContent>
              <TabsContent value="monthly">
                <CardDescription>過去6ヶ月間</CardDescription>
                {renderViewsChart(analyticsData.monthlyViews)}
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>人気の料理</CardTitle>
            <CardDescription>最も閲覧されたメニュー項目</CardDescription>
          </CardHeader>
          <CardContent>{renderPopularDishes()}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>分析設定</CardTitle>
            <CardDescription>Supabaseトラッキングの設定</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-sm mb-4">
                Supabaseで実際の分析トラッキングを実装するには、以下が必要です：
              </p>
              <ol className="list-decimal list-inside text-sm space-y-2">
                <li>
                  Supabaseに{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    menu_analytics
                  </code>{" "}
                  テーブルを作成する
                </li>
                <li>Homeコンポーネントにトラッキングコードを追加する</li>
                <li>モックデータを実際のSupabaseクエリに置き換える</li>
              </ol>
              <div className="mt-4 text-sm">
                <p className="font-medium">推奨テーブル構造：</p>
                <pre className="bg-gray-200 p-2 rounded mt-2 overflow-x-auto text-xs">
                  {`CREATE TABLE menu_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL,
  time_chunk TEXT NOT NULL,
  page_viewed TEXT NOT NULL,
  user_id TEXT,
  device_type TEXT,
  year INT GENERATED ALWAYS AS (EXTRACT(YEAR FROM timestamp)) STORED,
  month INT GENERATED ALWAYS AS (EXTRACT(MONTH FROM timestamp)) STORED
);`}
                </pre>
              </div>
              <div className="mt-4 text-sm">
                <p className="font-medium">年間データのクエリ例：</p>
                <pre className="bg-gray-200 p-2 rounded mt-2 overflow-x-auto text-xs">
                  {`-- 2025年2月のデータを時間帯別に取得するクエリ
SELECT 
  time_chunk, 
  COUNT(*) as view_count
FROM menu_analytics
WHERE 
  year = 2025 AND 
  month = 2
GROUP BY time_chunk;`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
