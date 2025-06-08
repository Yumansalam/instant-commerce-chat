
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { FileUpload } from '@/components/FileUpload';
import { ArrowLeft, User, LogOut } from 'lucide-react';

const Account = () => {
  const { user, profile, updateProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    profile_picture_url: profile?.profile_picture_url || ''
  });

  // Redirect if not logged in or not buyer
  if (!loading && (!user || profile?.role !== 'buyer')) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, profile_picture_url: url }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="border-purple-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="border-red-200 text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {formData.profile_picture_url ? (
                <img 
                  src={formData.profile_picture_url} 
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center border-4 border-purple-200">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Account
            </CardTitle>
            <p className="text-sm text-gray-600">{profile?.email}</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="profile-picture" className="text-sm">Profile Picture</Label>
                <FileUpload onUpload={handleImageUpload} folder="profiles">
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <p className="text-sm text-gray-600">Click to upload profile picture</p>
                  </div>
                </FileUpload>
              </div>

              <div>
                <Label htmlFor="full_name" className="text-sm">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="h-9 text-sm border-purple-200"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  className="h-9 text-sm border-purple-200"
                />
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Account Type</p>
                <p className="text-sm font-medium capitalize text-purple-600">{profile?.role} Account</p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-9 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
