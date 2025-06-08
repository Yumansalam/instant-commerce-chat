
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/hooks/useStore';
import { useProducts } from '@/hooks/useProducts';
import { FileUpload } from '@/components/FileUpload';
import { AIProductGenerator } from '@/components/AIProductGenerator';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const AdminContent = () => {
  const { storeSettings, updateStoreSettings, loading: storeLoading } = useStore();
  const { products, addProduct, updateProduct, deleteProduct, loading: productsLoading } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Store settings form
  const [storeForm, setStoreForm] = useState({
    business_name: '',
    whatsapp_number: '',
    logo_url: '',
    currency: 'USD'
  });

  // Product form
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    visible: true
  });

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' }
  ];

  useEffect(() => {
    if (storeSettings) {
      setStoreForm({
        business_name: storeSettings.business_name || '',
        whatsapp_number: storeSettings.whatsapp_number || '',
        logo_url: storeSettings.logo_url || '',
        currency: storeSettings.currency || 'USD'
      });
    }
  }, [storeSettings]);

  const handleSaveSettings = async () => {
    await updateStoreSettings(storeForm);
  };

  const handleLogoUpload = (url: string) => {
    setStoreForm(prev => ({ ...prev, logo_url: url }));
  };

  const handleProductImageUpload = (url: string) => {
    setProductForm(prev => ({ ...prev, image_url: url }));
  };

  const handleSaveProduct = async () => {
    if (!productForm.title || !productForm.price) {
      return;
    }

    const productData = {
      title: productForm.title,
      description: productForm.description,
      price: parseFloat(productForm.price),
      image_url: productForm.image_url,
      category: productForm.category,
      visible: productForm.visible
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
    } else {
      await addProduct(productData);
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

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url || '',
      category: product.category || '',
      visible: product.visible
    });
    setShowProductForm(true);
  };

  const handleAIGenerate = (data: { title: string; description: string; category: string }) => {
    setProductForm(prev => ({
      ...prev,
      title: data.title,
      description: data.description,
      category: data.category
    }));
  };

  const toggleProductVisibility = async (productId: string, currentVisibility: boolean) => {
    await updateProduct(productId, { visible: !currentVisibility });
  };

  if (storeLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-3 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Manage your store and products</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild className="border-purple-200 hover:bg-purple-50 h-8 px-3 text-xs">
              <Link to="/" className="flex items-center space-x-1">
                <ArrowLeft className="h-3 w-3" />
                <span>Store</span>
              </Link>
            </Button>
            <Button 
              onClick={() => setShowProductForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-8 px-3 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Product
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-purple-200 h-8">
            <TabsTrigger value="products" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-xs h-6">Products</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-xs h-6">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {!showProductForm ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <Card key={product.id} className="relative bg-white/70 backdrop-blur-sm border-purple-100 hover:border-purple-300 transition-all duration-300">
                    <CardContent className="p-3">
                      <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
                          <Badge variant={product.visible ? "default" : "secondary"} className={`text-xs ${product.visible ? "bg-green-500" : ""}`}>
                            {product.visible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-xs line-clamp-2">{product.description}</p>
                        <p className="text-lg font-bold text-purple-600">
                          <CurrencyDisplay amount={product.price} currency={storeSettings?.currency || 'USD'} />
                        </p>
                        
                        {product.category && (
                          <Badge variant="outline" className="border-purple-200 text-xs">{product.category}</Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-1 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                          className="border-purple-200 hover:bg-purple-50 h-7 w-7 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleProductVisibility(product.id, product.visible)}
                          className="border-purple-200 hover:bg-purple-50 h-7 w-7 p-0"
                        >
                          {product.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteProduct(product.id)}
                          className="border-red-200 hover:bg-red-50 hover:border-red-300 h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {products.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-purple-100">
                      <p className="text-gray-500 text-sm">No products yet. Add your first product to get started!</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm border-purple-100">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="title" className="text-xs">Product Title</Label>
                        <Input
                          id="title"
                          value={productForm.title}
                          onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter product title"
                          className="border-purple-200 focus:border-purple-400 h-8 text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price" className="text-xs">Price ({storeSettings?.currency || 'USD'})</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                          className="border-purple-200 focus:border-purple-400 h-8 text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="category" className="text-xs">Category</Label>
                        <Input
                          id="category"
                          value={productForm.category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Electronics, Fashion, Food"
                          className="border-purple-200 focus:border-purple-400 h-8 text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="image" className="text-xs">Product Image</Label>
                        <FileUpload onUpload={handleProductImageUpload} folder="products">
                          <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 text-center hover:border-purple-400 transition-colors cursor-pointer">
                            <p className="text-gray-600 text-xs">Click to upload image</p>
                          </div>
                        </FileUpload>
                        {productForm.image_url && (
                          <div className="mt-2">
                            <img
                              src={productForm.image_url}
                              alt="Preview"
                              className="w-full h-24 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="description" className="text-xs">Description</Label>
                        <Textarea
                          id="description"
                          value={productForm.description}
                          onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your product..."
                          className="min-h-24 border-purple-200 focus:border-purple-400 text-sm"
                        />
                      </div>
                      
                      <AIProductGenerator
                        onGenerate={handleAIGenerate}
                        imageUrl={productForm.image_url}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSaveProduct}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-8 px-4 text-xs"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {editingProduct ? 'Update' : 'Save'}
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
                      className="border-purple-200 hover:bg-purple-50 h-8 px-4 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/70 backdrop-blur-sm border-purple-100">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Store Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName" className="text-xs">Business Name</Label>
                    <Input
                      id="businessName"
                      value={storeForm.business_name}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, business_name: e.target.value }))}
                      placeholder="Your Store Name"
                      className="border-purple-200 focus:border-purple-400 h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="whatsapp" className="text-xs">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      value={storeForm.whatsapp_number}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      placeholder="+1234567890"
                      className="border-purple-200 focus:border-purple-400 h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="currency" className="text-xs">Currency</Label>
                    <Select
                      value={storeForm.currency}
                      onValueChange={(value) => setStoreForm(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="border-purple-200 focus:border-purple-400 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code} className="text-sm">
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="logo" className="text-xs">Store Logo</Label>
                    <FileUpload onUpload={handleLogoUpload} folder="logos">
                      <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 text-center hover:border-purple-400 transition-colors cursor-pointer">
                        {storeForm.logo_url ? (
                          <img
                            src={storeForm.logo_url}
                            alt="Current logo"
                            className="w-12 h-12 object-cover rounded mx-auto"
                          />
                        ) : (
                          <p className="text-gray-600 text-xs">Click to upload logo</p>
                        )}
                      </div>
                    </FileUpload>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-8 px-4 text-xs"
                >
                  <Save className="h-3 w-3 mr-1" />
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

const Admin = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminContent />
    </ProtectedRoute>
  );
};

export default Admin;
