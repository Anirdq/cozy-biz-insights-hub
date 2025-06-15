
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataImportExport } from "@/components/DataImportExport";
import { SampleDataManager } from "@/components/SampleDataManager";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Database, Upload, Download, Settings, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";

const DataManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

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
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Management</h1>
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
                  Data Management Center
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage sample data, import/export functionality, and configure analytics filters
                </p>
              </div>

              <Tabs defaultValue="sample-data" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sample-data" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Sample Data
                  </TabsTrigger>
                  <TabsTrigger value="import-export" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import/Export
                  </TabsTrigger>
                  <TabsTrigger value="filters" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Analytics Filters
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sample-data">
                  <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-white">
                        <Database className="h-5 w-5 mr-2 text-blue-600" />
                        Sample Data Management
                      </CardTitle>
                      <CardDescription className="dark:text-slate-400">
                        Generate, update, and manage sample data for testing and development
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SampleDataManager />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="import-export">
                  <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-white">
                        <Upload className="h-5 w-5 mr-2 text-green-600" />
                        Data Import/Export
                      </CardTitle>
                      <CardDescription className="dark:text-slate-400">
                        Import data from CSV/JSON files or export existing data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataImportExport />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="filters">
                  <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-white">
                        <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                        Analytics Date Filters
                      </CardTitle>
                      <CardDescription className="dark:text-slate-400">
                        Configure date range filters for analytics and reporting
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DateRangeFilter 
                        dateRange={dateRange} 
                        onDateRangeChange={setDateRange}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DataManagement;
