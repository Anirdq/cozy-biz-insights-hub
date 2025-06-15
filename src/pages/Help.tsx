
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HelpCircle, Search, BookOpen, MessageCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Help = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: helpArticles, isLoading } = useQuery({
    queryKey: ['help-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const filteredArticles = helpArticles?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categories = [...new Set(helpArticles?.map(article => article.category) || [])];

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
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Help Center</h1>
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
                  How can we help you?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Find answers to common questions and get support
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search help articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Documentation</CardTitle>
                    <CardDescription>
                      Browse our comprehensive guides and tutorials
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <MessageCircle className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Live Chat</CardTitle>
                    <CardDescription>
                      Get instant help from our support team
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Email Support</CardTitle>
                    <CardDescription>
                      Send us an email and we'll get back to you
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Browse by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm(category)}
                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Help Articles */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Articles'}
                </h3>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="text-slate-500">Loading help articles...</div>
                  </div>
                ) : filteredArticles.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardContent className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        No articles found. Try adjusting your search terms.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredArticles.map((article) => (
                      <Card key={article.id} className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg text-slate-800 dark:text-white">
                                {article.title}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {article.content.substring(0, 150)}...
                              </CardDescription>
                            </div>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              {article.category}
                            </span>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Help;
