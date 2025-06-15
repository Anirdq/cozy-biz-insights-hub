
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  notifications: boolean;
  emailAlerts: boolean;
  autoRefresh: boolean;
  theme: 'light' | 'dark';
  refreshInterval: number;
  fullName: string;
  email: string;
  company: string;
}

const defaultSettings: UserSettings = {
  notifications: true,
  emailAlerts: false,
  autoRefresh: true,
  theme: 'light',
  refreshInterval: 30,
  fullName: '',
  email: '',
  company: ''
};

export const useUserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from Supabase
  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('setting_key, setting_value')
        .eq('user_id', user.id);

      if (error) throw error;

      const loadedSettings = { ...defaultSettings };
      
      // Pre-populate with user data
      loadedSettings.email = user.email || '';
      loadedSettings.fullName = user.user_metadata?.full_name || '';

      // Apply saved settings
      data?.forEach(({ setting_key, setting_value }) => {
        if (setting_key in loadedSettings) {
          try {
            loadedSettings[setting_key as keyof UserSettings] = JSON.parse(setting_value);
          } catch {
            // If parsing fails, use the raw value for strings
            loadedSettings[setting_key as keyof UserSettings] = setting_value as any;
          }
        }
      });

      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error loading settings",
        description: "Failed to load your preferences. Using defaults.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a single setting
  const saveSetting = async (key: keyof UserSettings, value: any) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('upsert_user_setting', {
        p_user_id: user.id,
        p_setting_key: key,
        p_setting_value: JSON.stringify(value)
      });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: "Error saving setting",
        description: "Failed to save your preference. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Save all settings
  const saveAllSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Save each setting individually
      const promises = Object.entries(newSettings).map(([key, value]) =>
        supabase.rpc('upsert_user_setting', {
          p_user_id: user.id,
          p_setting_key: key,
          p_setting_value: JSON.stringify(value)
        })
      );

      const results = await Promise.all(promises);
      const hasError = results.some(result => result.error);

      if (hasError) {
        throw new Error('Some settings failed to save');
      }

      setSettings(prev => ({ ...prev, ...newSettings }));
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Load settings when user changes
  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setSettings(defaultSettings);
      setIsLoading(false);
    }
  }, [user]);

  return {
    settings,
    isLoading,
    isSaving,
    saveSetting,
    saveAllSettings,
    setSettings
  };
};
