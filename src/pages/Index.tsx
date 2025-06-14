
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">BizDash</h1>
          </div>
          <Link to="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-800 mb-6">
            Track Your Business
            <span className="text-blue-600 block">Performance</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Get real-time insights into your sales, traffic, and KPIs with our intuitive dashboard designed for small businesses.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              View Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Sales Analytics</CardTitle>
              <CardDescription>
                Monitor your revenue trends, conversion rates, and sales performance with interactive charts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-teal-100 rounded-full w-fit">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-xl">Traffic Insights</CardTitle>
              <CardDescription>
                Track website visitors, page views, and user engagement metrics in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">KPI Dashboard</CardTitle>
              <CardDescription>
                Keep an eye on your key performance indicators and business metrics that matter most.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-slate-800 mb-8">
            Trusted by Small Businesses
          </h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-slate-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">500M+</div>
              <div className="text-slate-600">Data Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-slate-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-slate-600">Support</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
