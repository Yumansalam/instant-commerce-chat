
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const Admin = () => {
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Store Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your store and products</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" asChild className="border-purple-200 hover:bg-purple-50">
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
          <TabsList className="bg-white/70 backdrop-blur-sm border border-purple-200">
            <TabsTrigger value="products" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">Products</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">Store Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {!showProductForm ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="relative bg-white/70 backdrop-blur-sm border-purple-100 hover:border-purple-300 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                          <Badge variant={product.visible ? "default" : "secondary"} className={product.visible ? "bg-green-500" : ""}>
                            {product.visible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                        <p className="text-xl font-bold text-purple-600">
                          <CurrencyDisplay amount={product.price} currency={storeSettings?.currency || 'USD'} />
                        </p>
                        
                        {product.category && (
                          <Badge variant="outline" className="border-purple-200">{product.category}</Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                          className="border-purple-200 hover:bg-purple-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleProductVisibility(product.id, product.visible)}
                          className="border-purple-200 hover:bg-purple-50"
                        >
                          {product.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteProduct(product.id)}
                          className="border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {products.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 border border-purple-100">
                      <p className="text-gray-500">No products yet. Add your first product to get started!</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm border-purple-100">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Product Title</Label>
                        <Input
                          id="title"
                          value={productForm.title}
                          onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter product title"
                          className="border-purple-200 focus:border-purple-400"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price">Price ({storeSettings?.currency || 'USD'})</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                          className="border-purple-200 focus:border-purple-400"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={productForm.category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Electronics, Fashion, Food"
                          className="border-purple-200 focus:border-purple-400"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="image">Product Image</Label>
                        <FileUpload onUpload={handleProductImageUpload} folder="products">
                          <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                            <p className="text-gray-600">Click to upload image</p>
                          </div>
                        </FileUpload>
                        {productForm.image_url && (
                          <div className="mt-2">
                            <img
                              src={productForm.image_url}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded border"
                            />
                          </div>
                        )}
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
                          className="min-h-32 border-purple-200 focus:border-purple-400"
                        />
                      </div>
                      
                      <AIProductGenerator
                        onGenerate={handleAIGenerate}
                        imageUrl={productForm.image_url}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      onClick={handleSaveProduct}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
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
                      className="border-purple-200 hover:bg-purple-50"
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
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Store Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={storeForm.business_name}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, business_name: e.target.value }))}
                      placeholder="Your Store Name"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      value={storeForm.whatsapp_number}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      placeholder="+1234567890"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={storeForm.currency}
                      onValueChange={(value) => setStoreForm(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="border-purple-200 focus:border-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="logo">Store Logo</Label>
                    <FileUpload onUpload={handleLogoUpload} folder="logos">
                      <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                        {storeForm.logo_url ? (
                          <img
                            src={storeForm.logo_url}
                            alt="Current logo"
                            className="w-16 h-16 object-cover rounded mx-auto"
                          />
                        ) : (
                          <p className="text-gray-600">Click to upload logo</p>
                        )}
                      </div>
                    </FileUpload>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
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
