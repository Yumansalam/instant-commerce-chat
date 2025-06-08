import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/FileUpload';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const StartStore = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    whatsapp_number: '',
    logo_url: '',
    banner_url: '',
    theme_color: '#9333ea'
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleLogo = (url: string) => setForm(prev => ({ ...prev, logo_url: url }));
  const handleBanner = (url: string) => setForm(prev => ({ ...prev, banner_url: url }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from('stores')
      .insert({
        name: form.name,
        slug: form.slug,
        description: '',
        whatsapp_number: form.whatsapp_number,
        logo_url: form.logo_url,
        banner_url: form.banner_url,
        theme_color: form.theme_color,
        created_by: user.id
      })
      .select()
      .single();

    if (!error && data) {
      await supabase
        .from('profiles')
        .update({ role: 'admin', store_id: data.id })
        .eq('id', user.id);
      await updateProfile({ role: 'admin', store_id: data.id });
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <Card className="w-full max-w-lg bg-white/80 backdrop-blur-sm border-purple-100">
        <CardHeader>
          <CardTitle className="text-xl text-center">Start Your Store</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs">Store Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="h-9 text-sm" />
            </div>
            <div>
              <Label htmlFor="slug" className="text-xs">Store Slug</Label>
              <Input id="slug" value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} className="h-9 text-sm" />
            </div>
            <div>
              <Label htmlFor="whatsapp" className="text-xs">WhatsApp Number</Label>
              <Input id="whatsapp" value={form.whatsapp_number} onChange={e => setForm(prev => ({ ...prev, whatsapp_number: e.target.value }))} className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Logo</Label>
              <FileUpload onUpload={handleLogo} folder="logos">
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 text-center cursor-pointer">
                  <p className="text-gray-600 text-xs">Upload Logo</p>
                </div>
              </FileUpload>
            </div>
            <div>
              <Label className="text-xs">Banner</Label>
              <FileUpload onUpload={handleBanner} folder="banners">
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 text-center cursor-pointer">
                  <p className="text-gray-600 text-xs">Upload Banner</p>
                </div>
              </FileUpload>
            </div>
            <div>
              <Label htmlFor="color" className="text-xs">Theme Color</Label>
              <Input id="color" type="color" value={form.theme_color} onChange={e => setForm(prev => ({ ...prev, theme_color: e.target.value }))} className="h-9 p-1" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-9 text-sm">
              {loading ? 'Creating...' : 'Create Store'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartStore;
