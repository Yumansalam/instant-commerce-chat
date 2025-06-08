
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Store, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  user_id: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreInfo {
  business_name: string;
  logo_url?: string;
  whatsapp_number: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();

  // Mock data for demo - in real app this would come from Supabase
  useEffect(() => {
    // Simulate loading store info and products
    setStoreInfo({
      business_name: "TechStore Plus",
      logo_url: "/placeholder.svg",
      whatsapp_number: "+1234567890"
    });

    setProducts([
      {
        id: "1",
        title: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and 24-hour battery life.",
        price: 299.99,
        image_url: "/placeholder.svg",
        category: "Electronics",
        user_id: "1"
      },
      {
        id: "2", 
        title: "Organic Cotton T-Shirt",
        description: "Soft, comfortable organic cotton t-shirt available in multiple colors.",
        price: 29.99,
        image_url: "/placeholder.svg",
        category: "Fashion",
        user_id: "1"
      },
      {
        id: "3",
        title: "Artisan Coffee Beans",
        description: "Premium single-origin coffee beans roasted to perfection.",
        price: 24.99,
        image_url: "/placeholder.svg",
        category: "Food",
        user_id: "1"
      }
    ]);
  }, []);

  const addToCart = (product: Product) => {
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
      description: `${product.title} has been added to your cart.`,
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
      `${item.title} - Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = getCartTotal().toFixed(2);
    
    return encodeURIComponent(
      `Hi! I'd like to place an order:\n\n${cartItems}\n\nTotal: $${total}\n\nPlease confirm my order. Thank you!`
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

    if (!storeInfo?.whatsapp_number) {
      toast({
        title: "Store not configured",
        description: "WhatsApp number not set up for this store.",
        variant: "destructive"
      });
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${storeInfo.whatsapp_number.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {storeInfo?.logo_url && (
                <img 
                  src={storeInfo.logo_url} 
                  alt="Store Logo"
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {storeInfo?.business_name || 'Loading...'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/admin" 
                className="text-sm text-gray-600 hover:text-primary flex items-center space-x-1"
              >
                <Store className="h-4 w-4" />
                <span>Admin</span>
              </a>
              
              <Button
                variant="outline"
                size="sm"
                className="relative"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-4 w-4" />
                {getCartItemCount() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Floating Cart */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-lg w-full max-w-md max-h-96 overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-4 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
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

export default Index;
