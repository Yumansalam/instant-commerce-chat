
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, Wand2, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  visible: boolean;
  user_id: string;
}

interface StoreSettings {
  business_name: string;
  whatsapp_number: string;
  logo_url?: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    business_name: '',
    whatsapp_number: '',
    logo_url: ''
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    visible: true
  });

  // Mock data - in real app this would come from Supabase
  useEffect(() => {
    setStoreSettings({
      business_name: "TechStore Plus",
      whatsapp_number: "+1234567890",
      logo_url: "/placeholder.svg"
    });

    setProducts([
      {
        id: "1",
        title: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and 24-hour battery life.",
        price: 299.99,
        image_url: "/placeholder.svg",
        category: "Electronics",
        visible: true,
        user_id: "1"
      },
      {
        id: "2",
        title: "Organic Cotton T-Shirt",
        description: "Soft, comfortable organic cotton t-shirt available in multiple colors.",
        price: 29.99,
        image_url: "/placeholder.svg",
        category: "Fashion",
        visible: true,
        user_id: "1"
      }
    ]);
  }, []);

  const handleSaveSettings = () => {
    // In real app, save to Supabase
    toast({
      title: "Settings saved",
      description: "Your store settings have been updated successfully."
    });
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const suggestions = [
        {
          title: "Premium Smart Gadget",
          description: "Experience the future with this innovative smart device that seamlessly integrates into your daily life.",
          category: "Electronics"
        },
        {
          title: "Artisan Coffee Blend",
          description: "Rich, full-bodied coffee blend sourced from the finest farms around the world.",
          category: "Food & Beverage"
        },
        {
          title: "Designer Fashion Accessory",
          description: "Elevate your style with this carefully crafted accessory that combines elegance and functionality.",
          category: "Fashion"
        }
      ];

      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      setProductForm(prev => ({
        ...prev,
        title: randomSuggestion.title,
        description: randomSuggestion.description,
        category: randomSuggestion.category
      }));

      setIsGenerating(false);
      toast({
        title: "AI Generated!",
        description: "Product details have been generated. Feel free to edit them."
      });
    }, 2000);
  };

  const handleSaveProduct = () => {
    if (!productForm.title || !productForm.price) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and price.",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      title: productForm.title,
      description: productForm.description,
      price: parseFloat(productForm.price),
      image_url: productForm.image_url || "/placeholder.svg",
      category: productForm.category,
      visible: productForm.visible,
      user_id: "1"
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
      toast({ title: "Product updated successfully!" });
    } else {
      setProducts(prev => [...prev, newProduct]);
      toast({ title: "Product created successfully!" });
    }

    // Reset form
    setProductForm({
      title: '',
      description: '',
      price: '',
      image_url: '',
      category: '',
      visible: true
    });
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      category: product.category || '',
      visible: product.visible
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({ title: "Product deleted successfully!" });
  };

  const toggleProductVisibility = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, visible: !p.visible } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
            <p className="text-gray-600">Manage your store and products</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <a href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>View Store</span>
              </a>
            </Button>
            <Button 
              onClick={() => setShowProductForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Store Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {!showProductForm ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="relative">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                          <Badge variant={product.visible ? "default" : "secondary"}>
                            {product.visible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                        <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                        
                        {product.category && (
                          <Badge variant="outline">{product.category}</Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleProductVisibility(product.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {products.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No products yet. Add your first product to get started!</p>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Product Title</Label>
                        <Input
                          id="title"
                          value={productForm.title}
                          onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter product title"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={productForm.category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Electronics, Fashion, Food"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={productForm.image_url}
                          onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={productForm.description}
                          onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your product..."
                          className="min-h-32"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateWithAI}
                          disabled={isGenerating}
                          className="w-full"
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </Button>
                        
                        {productForm.image_url && (
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={productForm.image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button onClick={handleSaveProduct}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingProduct ? 'Update Product' : 'Save Product'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        setProductForm({
                          title: '',
                          description: '',
                          price: '',
                          image_url: '',
                          category: '',
                          visible: true
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={storeSettings.business_name}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, business_name: e.target.value }))}
                      placeholder="Your Store Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      value={storeSettings.whatsapp_number}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      placeholder="+1234567890"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={storeSettings.logo_url}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
