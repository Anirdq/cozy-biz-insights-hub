
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
  const [error, setError] = useState<string | null>(null);
  const [savingField, setSavingField] = useState<string | null>(null);

  // Load settings from Supabase
  const loadSettings = async () => {
    if (!user) {
      setSettings(defaultSettings);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('setting_key, setting_value')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw new Error(`Failed to load settings: ${fetchError.message}`);
      }

      const loadedSettings = { ...defaultSettings };
      
      // Pre-populate with user data
      loadedSettings.email = user.email || '';
      loadedSettings.fullName = user.user_metadata?.full_name || '';

      // Apply saved settings with better error handling
      data?.forEach(({ setting_key, setting_value }) => {
        if (setting_key in loadedSettings) {
          try {
            const parsedValue = JSON.parse(setting_value);
            (loadedSettings as any)[setting_key] = parsedValue;
          } catch (parseError) {
            console.warn(`Failed to parse setting ${setting_key}:`, parseError);
            // If parsing fails, use the raw value for strings
            if (typeof (loadedSettings as any)[setting_key] === 'string') {
              (loadedSettings as any)[setting_key] = setting_value;
            }
          }
        }
      });

      setSettings(loadedSettings);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error loading settings:', error);
      setError(errorMessage);
      toast({
        title: "Error loading settings",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a single setting with field-specific loading state
  const saveSetting = async (key: keyof UserSettings, value: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save settings.",
        variant: "destructive"
      });
      return false;
    }

    setSavingField(key);
    setError(null);

    try {
      const { error: saveError } = await supabase.rpc('upsert_user_setting', {
        p_user_id: user.id,
        p_setting_key: key,
        p_setting_value: JSON.stringify(value)
      });

      if (saveError) {
        console.error('Supabase save error:', saveError);
        throw new Error(`Failed to save ${key}: ${saveError.message}`);
      }

      setSettings(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Setting saved",
        description: `${key} has been updated successfully.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error saving setting:', error);
      setError(errorMessage);
      toast({
        title: "Error saving setting",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setSavingField(null);
    }
  };

  // Save all settings with comprehensive error handling
  const saveAllSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save settings.",
        variant: "destructive"
      });
      return false;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      // Save each setting individually and track failures
      const settingEntries = Object.entries(newSettings);
      const results = await Promise.allSettled(
        settingEntries.map(([key, value]) =>
          supabase.rpc('upsert_user_setting', {
            p_user_id: user.id,
            p_setting_key: key,
            p_setting_value: JSON.stringify(value)
          })
        )
      );

      const failures = results
        .map((result, index) => ({ result, key: settingEntries[index][0] }))
        .filter(({ result }) => result.status === 'rejected' || result.value?.error)
        .map(({ key, result }) => ({
          key,
          error: result.status === 'rejected' 
            ? result.reason 
            : (result.value as any)?.error
        }));

      if (failures.length > 0) {
        console.error('Some settings failed to save:', failures);
        const failedKeys = failures.map(f => f.key).join(', ');
        throw new Error(`Failed to save: ${failedKeys}`);
      }

      setSettings(prev => ({ ...prev, ...newSettings }));
      
      toast({
        title: "Settings saved",
        description: "All preferences have been updated successfully.",
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error saving settings:', error);
      setError(errorMessage);
      toast({
        title: "Error saving settings",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Retry mechanism for failed operations
  const retryLoadSettings = () => {
    loadSettings();
  };

  // Load settings when user changes
  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setSettings(defaultSettings);
      setIsLoading(false);
      setError(null);
    }
  }, [user]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    savingField,
    saveSetting,
    saveAllSettings,
    setSettings,
    retryLoadSettings
  };
};
