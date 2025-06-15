
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TrafficChart } from "@/components/TrafficChart";
import { Users, Eye, Clock, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Traffic = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { data: trafficData, isLoading } = useQuery({
    queryKey: ['traffic-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('traffic_data')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const totalVisitors = trafficData?.reduce((sum, item) => sum + item.visitors, 0) || 0;
  const totalPageViews = trafficData?.reduce((sum, item) => sum + item.page_views, 0) || 0;
  const avgBounceRate = trafficData?.reduce((sum, item) => sum + parseFloat(item.bounce_rate), 0) / (trafficData?.length || 1) || 0;
  const avgSessionDuration = trafficData?.reduce((sum, item) => sum + item.avg_session_duration, 0) / (trafficData?.length || 1) || 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <SidebarInset className="flex-1">
            <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Traffic Analytics</h1>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="dark:border-slate-600 dark:text-slate-300"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </Button>
              </div>
            </header>

            <main className="container mx-auto px-6 py-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Website Traffic
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Monitor visitor behavior and engagement metrics
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                    <Users className="h-4 w-4 text-teal-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+8.2% from last period</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                    <Eye className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalPageViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+5.1% from last period</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{avgBounceRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">-2.4% from last period</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
                    <Clock className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.floor(avgSessionDuration / 60)}m {avgSessionDuration % 60}s</div>
                    <p className="text-xs text-muted-foreground">+15s from last period</p>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic Chart */}
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-white">
                    <Users className="h-5 w-5 mr-2 text-teal-600" />
                    Traffic Trends
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Visitor patterns and engagement over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-slate-500">Loading traffic data...</div>
                    </div>
                  ) : (
                    <TrafficChart />
                  )}
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Traffic;
