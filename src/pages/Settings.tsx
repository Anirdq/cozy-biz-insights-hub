
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Settings as SettingsIcon, Save, User, Bell, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    autoRefresh: true,
    theme: 'light',
    refreshInterval: 30
  });
  const { toast } = useToast();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSaveSettings = () => {
    // Here you would typically save to Supabase user_settings table
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
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
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
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
                  Account Settings
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your account preferences and dashboard settings
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-white">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Enter company name" />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-white">
                      <Bell className="h-5 w-5 mr-2 text-teal-600" />
                      Notifications
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Configure your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications}
                        onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important alerts via email
                        </p>
                      </div>
                      <Switch
                        checked={settings.emailAlerts}
                        onCheckedChange={(checked) => handleSettingChange('emailAlerts', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Settings */}
                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-white">
                      <SettingsIcon className="h-5 w-5 mr-2 text-purple-600" />
                      Dashboard Preferences
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Customize your dashboard experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Refresh</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically refresh data
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoRefresh}
                        onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                      <Input
                        id="refresh-interval"
                        type="number"
                        value={settings.refreshInterval}
                        onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                        min="10"
                        max="300"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-white">
                      <Shield className="h-5 w-5 mr-2 text-red-600" />
                      Security
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Manage your security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full">
                      Enable Two-Factor Auth
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Settings;
