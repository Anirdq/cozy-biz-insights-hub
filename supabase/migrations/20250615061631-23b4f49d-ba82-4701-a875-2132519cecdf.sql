
-- Create tables for sales data
CREATE TABLE public.sales_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  orders INTEGER NOT NULL DEFAULT 0,
  conversion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for traffic data
CREATE TABLE public.traffic_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  visitors INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  avg_session_duration INTEGER NOT NULL DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for performance metrics
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  target_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for user settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, setting_key)
);

-- Create tables for help articles
CREATE TABLE public.help_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" 
  ON public.user_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for other tables (public read access for demo purposes)
ALTER TABLE public.sales_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo data
CREATE POLICY "Allow public read access to sales_data" 
  ON public.sales_data FOR SELECT 
  TO public USING (true);

CREATE POLICY "Allow public read access to traffic_data" 
  ON public.traffic_data FOR SELECT 
  TO public USING (true);

CREATE POLICY "Allow public read access to performance_metrics" 
  ON public.performance_metrics FOR SELECT 
  TO public USING (true);

CREATE POLICY "Allow public read access to help_articles" 
  ON public.help_articles FOR SELECT 
  TO public USING (true);

-- Insert sample data for sales
INSERT INTO public.sales_data (date, revenue, orders, conversion_rate) VALUES
  ('2024-01-01', 12500.00, 45, 3.2),
  ('2024-01-02', 13200.00, 52, 3.5),
  ('2024-01-03', 11800.00, 41, 2.9),
  ('2024-01-04', 14500.00, 58, 3.8),
  ('2024-01-05', 13900.00, 55, 3.6);

-- Insert sample data for traffic
INSERT INTO public.traffic_data (date, visitors, page_views, bounce_rate, avg_session_duration) VALUES
  ('2024-01-01', 1250, 3200, 45.2, 180),
  ('2024-01-02', 1320, 3450, 42.8, 195),
  ('2024-01-03', 1180, 2980, 48.1, 165),
  ('2024-01-04', 1450, 3890, 39.5, 210),
  ('2024-01-05', 1390, 3650, 41.2, 200);

-- Insert sample data for performance metrics
INSERT INTO public.performance_metrics (date, metric_name, metric_value, target_value) VALUES
  ('2024-01-01', 'Customer Satisfaction', 8.5, 9.0),
  ('2024-01-01', 'Response Time', 2.3, 2.0),
  ('2024-01-01', 'Uptime', 99.9, 99.5),
  ('2024-01-02', 'Customer Satisfaction', 8.7, 9.0),
  ('2024-01-02', 'Response Time', 2.1, 2.0),
  ('2024-01-02', 'Uptime', 99.8, 99.5);

-- Insert sample help articles
INSERT INTO public.help_articles (title, content, category) VALUES
  ('Getting Started with BizDash', 'Welcome to BizDash! This guide will help you get started with monitoring your business performance...', 'Getting Started'),
  ('Understanding Your Sales Data', 'Your sales dashboard provides insights into revenue trends, order patterns, and conversion rates...', 'Sales'),
  ('Traffic Analytics Explained', 'Learn how to interpret your website traffic data and identify growth opportunities...', 'Traffic'),
  ('Setting Up Performance Goals', 'Configure targets and benchmarks to track your business performance effectively...', 'Performance'),
  ('Managing Your Account Settings', 'Customize your BizDash experience by configuring your account preferences...', 'Settings');
