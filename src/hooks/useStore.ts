
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface StoreSettings {
  id: string;
  business_name: string;
  whatsapp_number: string;
  logo_url: string | null;
  currency: string;
  email: string;
  profile_id: string | null;
}

export const useStore = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStoreSettings = async () => {
    try {
      let query = supabase.from('store_owners').select('*');
      if (user) {
        query = query.eq('profile_id', user.id);
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
      if (!storeSettings) {
        // Create new store tied to the current profile
        const { data, error } = await supabase
          .from('store_owners')
          .insert([
            {
              business_name: updates.business_name || '',
              whatsapp_number: updates.whatsapp_number || '',
              logo_url: updates.logo_url || null,
              currency: updates.currency || 'USD',
              email: updates.email || 'store@example.com',
              profile_id: user ? user.id : null
            }
          ])
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
          .eq('profile_id', user ? user.id : storeSettings.profile_id)
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
