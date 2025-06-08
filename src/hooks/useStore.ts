
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface StoreSettings {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  whatsapp_number: string;
  logo_url: string | null;
  banner_url: string | null;
  theme_color: string | null;
  created_by: string;
}

export const useStore = (slug?: string) => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();

  const fetchStoreSettings = async () => {
    try {
      let query = supabase.from('stores').select('*');
      if (slug) {
        query = query.eq('slug', slug);
      } else if (profile?.store_id) {
        query = query.eq('id', profile.store_id);
      }
      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching store settings:', error);
        return;
      }

      if (data) {
        setStoreSettings(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStoreSettings = async (updates: Partial<StoreSettings>) => {
    try {
      if (!storeSettings) return;
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', storeSettings.id)
        .select()
        .single();

      if (error) throw error;
      setStoreSettings(data);

      toast({
        title: "Settings saved",
        description: "Your store settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error updating store settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchStoreSettings();
  }, [slug, profile?.store_id]);

  return {
    storeSettings,
    loading,
    updateStoreSettings,
    refetch: fetchStoreSettings
  };
};
