
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Store, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (!error) {
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Store className="h-12 w-12 mx-auto text-purple-600 mb-4" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Store
          </h1>
          <p className="text-gray-600 text-sm mt-2">Sign in to start shopping or manage your account</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin" className="text-xs">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-xs">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="text-xs">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signin-password" className="text-xs">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-9 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-xs">Full Name</Label>
                    <Input
                      id="signup-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email" className="text-xs">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password" className="text-xs">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-9 text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-xs">
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
