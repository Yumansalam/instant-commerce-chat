
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StoreSettings {
  id: string;
  business_name: string;
  whatsapp_number: string;
  logo_url: string | null;
  currency: string;
  email: string;
}

export const useStore = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStoreSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_owners')
        .select('*')
        .single();

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
      if (!storeSettings) {
        // Create new store
        const { data, error } = await supabase
          .from('store_owners')
          .insert([{
            business_name: updates.business_name || '',
            whatsapp_number: updates.whatsapp_number || '',
            logo_url: updates.logo_url || null,
            currency: updates.currency || 'USD',
            email: updates.email || 'store@example.com'
          }])
          .select()
          .single();

        if (error) throw error;
        setStoreSettings(data);
      } else {
        // Update existing store
        const { data, error } = await supabase
          .from('store_owners')
          .update(updates)
          .eq('id', storeSettings.id)
          .select()
          .single();

        if (error) throw error;
        setStoreSettings(data);
      }

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
  }, []);

  return {
    storeSettings,
    loading,
    updateStoreSettings,
    refetch: fetchStoreSettings
  };
};
