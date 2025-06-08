
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, LogIn, Settings, Plus, Minus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/hooks/useStore';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

const Storefront = () => {
  const { store_slug } = useParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();

  const { storeSettings, loading: storeLoading } = useStore(store_slug as string);
  const { products, loading: productsLoading } = useProducts(storeSettings?.id);
  const { user, profile, isAdmin } = useAuth();

  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const generateWhatsAppMessage = () => {
    const cartItems = cart.map(item => 
      `${item.name} - Qty: ${item.quantity} - USD ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = getCartTotal().toFixed(2);
    const currency = 'USD';
    const storeName = storeSettings?.name || 'Our Store';
    
    return encodeURIComponent(
      `Hi! I'd like to order the following from ${storeName}:\n\n${cartItems}\n\nTotal: ${currency} ${total}\n\nPlease confirm my order. Thank you!`
    );
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    if (!storeSettings?.whatsapp_number) {
      toast({
        title: "Store not configured",
        description: "WhatsApp number not set up for this store.",
        variant: "destructive"
      });
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${storeSettings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const visibleProducts = products.filter(p => p.is_visible);
  const filteredProducts = visibleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(visibleProducts.map(p => p.category).filter(Boolean)))];

  if (storeLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Mobile-optimized Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-40">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {storeSettings?.logo_url && (
                <img 
                  src={storeSettings.logo_url} 
                  alt="Store Logo"
                  className="h-8 w-8 rounded-full object-cover border border-purple-200 flex-shrink-0"
                />
              )}
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
                  {storeSettings?.name || 'My Store'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              {user ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-purple-200 hover:bg-purple-50 h-8 px-2 text-xs"
                    >
                    <Link to="/admin">
                      <Settings className="h-3 w-3 mr-1" />
                      Admin
                    </Link>
                  </Button>
                )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-purple-200 hover:bg-purple-50 h-8 px-2 text-xs"
                  >
                    <Link to="/account">
                      <User className="h-3 w-3 mr-1" />
                      Account
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-purple-200 hover:bg-purple-50 h-8 px-2 text-xs"
                >
                  <Link to="/auth">
                    <LogIn className="h-3 w-3 mr-1" />
                    Sign In
                  </Link>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="relative border-purple-200 hover:bg-purple-50 h-8 w-8 p-0"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-3 w-3" />
                {getCartItemCount() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-pink-500 to-red-500"
                  >
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 py-4">
        {/* Mobile-optimized Search and Filters */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-purple-200 focus:border-purple-400 h-9 text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`h-7 px-3 text-xs ${selectedCategory === category 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  : "border-purple-200 hover:bg-purple-50"
                }`}
              >
                {category === 'all' ? 'All' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile-optimized Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map(product => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-purple-100 hover:border-purple-300 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="font-medium text-sm mb-1 line-clamp-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-1">{product.description}</p>
                
                <div className="flex flex-col space-y-2">
                  <span className="text-lg font-bold text-purple-600">
                      <CurrencyDisplay amount={product.price} currency={'USD'} />
                  </span>
                  <Button
                    size="sm"
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-7 text-xs"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Mobile-optimized Floating Cart */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-lg w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)} className="text-white hover:bg-white/20 h-8 w-8 p-0">
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-4 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-purple-600 font-semibold text-sm">
                            <CurrencyDisplay amount={item.price} currency={'USD'} />
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium text-sm w-6 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-4 border-t bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-sm">Total:</span>
                  <span className="text-lg font-bold text-purple-600">
                      <CurrencyDisplay amount={getCartTotal()} currency={'USD'} />
                  </span>
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 h-9 text-sm"
                  onClick={handleWhatsAppCheckout}
                >
                  Checkout via WhatsApp
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Storefront;
