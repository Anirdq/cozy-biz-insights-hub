
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { KPIChart } from "@/components/KPIChart";
import { BarChart3, Target, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Performance = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['performance-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
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

  // Group metrics by name for latest values
  const latestMetrics = performanceData?.reduce((acc, metric) => {
    if (!acc[metric.metric_name] || new Date(metric.date) > new Date(acc[metric.metric_name].date)) {
      acc[metric.metric_name] = metric;
    }
    return acc;
  }, {} as Record<string, any>) || {};

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
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Performance Metrics</h1>
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
                  Key Performance Indicators
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Track your business performance against targets
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.entries(latestMetrics).map(([metricName, metric]) => (
                  <Card key={metricName} className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{metricName}</CardTitle>
                      {metricName === 'Customer Satisfaction' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {metricName === 'Response Time' && <Clock className="h-4 w-4 text-blue-600" />}
                      {metricName === 'Uptime' && <Target className="h-4 w-4 text-purple-600" />}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {parseFloat(metric.metric_value).toFixed(1)}
                        {metricName === 'Response Time' && 's'}
                        {metricName === 'Uptime' && '%'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Target: {parseFloat(metric.target_value || 0).toFixed(1)}
                        {metricName === 'Response Time' && 's'}
                        {metricName === 'Uptime' && '%'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Performance Chart */}
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-white">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Track your key metrics against targets over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-slate-500">Loading performance data...</div>
                    </div>
                  ) : (
                    <KPIChart />
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

export default Performance;
