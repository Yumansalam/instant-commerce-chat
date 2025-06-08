
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIProductGeneratorProps {
  onGenerate: (data: { title: string; description: string; category: string }) => void;
  imageUrl?: string;
}

export const AIProductGenerator: React.FC<AIProductGeneratorProps> = ({ onGenerate, imageUrl }) => {
  const [productInfo, setProductInfo] = useState('');
  const [tone, setTone] = useState('friendly');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const tones = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'professional', label: 'Professional' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'simple', label: 'Simple' }
  ];

  const generateContent = async () => {
    if (!productInfo.trim()) {
      toast({
        title: "Product information required",
        description: "Please provide some information about your product.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate AI generation with realistic product data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate content based on product info and tone
      const generatedData = generateProductContent(productInfo, tone, imageUrl);
      
      onGenerate(generatedData);
      
      toast({
        title: "Content generated!",
        description: "AI has generated product title, description, and category."
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateProductContent = (info: string, selectedTone: string, hasImage?: string) => {
    const infoLower = info.toLowerCase();
    let title = '';
    let description = '';
    let category = '';

    // Determine category from product info
    if (infoLower.includes('electronics') || infoLower.includes('phone') || infoLower.includes('laptop') || infoLower.includes('computer')) {
      category = 'Electronics';
    } else if (infoLower.includes('clothing') || infoLower.includes('shirt') || infoLower.includes('dress') || infoLower.includes('fashion')) {
      category = 'Fashion';
    } else if (infoLower.includes('food') || infoLower.includes('snack') || infoLower.includes('drink') || infoLower.includes('meal')) {
      category = 'Food & Beverages';
    } else if (infoLower.includes('book') || infoLower.includes('education') || infoLower.includes('learning')) {
      category = 'Books & Education';
    } else if (infoLower.includes('beauty') || infoLower.includes('cosmetic') || infoLower.includes('skincare')) {
      category = 'Beauty & Health';
    } else {
      category = 'General';
    }

    // Generate title based on product info
    const words = info.split(' ').slice(0, 4);
    title = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Generate description based on tone
    switch (selectedTone) {
      case 'luxury':
        description = `Experience the epitome of excellence with this premium ${title.toLowerCase()}. Crafted with the finest attention to detail, this exceptional product offers unparalleled quality and sophistication. ${hasImage ? 'As shown in the image, ' : ''}every aspect has been meticulously designed to exceed your expectations and provide an luxurious experience.`;
        break;
      case 'professional':
        description = `Our ${title.toLowerCase()} is engineered for optimal performance and reliability. This product features advanced specifications and professional-grade quality. ${hasImage ? 'The product image showcases ' : ''}Built to meet industry standards, it delivers consistent results and exceptional value for professional use.`;
        break;
      case 'simple':
        description = `${title} - a quality product that works well. ${hasImage ? 'See image for details. ' : ''}Easy to use and reliable. Good value for money.`;
        break;
      default: // friendly
        description = `Meet your new favorite ${title.toLowerCase()}! This amazing product is perfect for anyone looking for quality and value. ${hasImage ? 'The image shows exactly what you\'ll get - ' : ''}We love how versatile and user-friendly it is. You're going to absolutely love this purchase!`;
    }

    return { title, description, category };
  };

  return (
    <Card className="border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center space-x-2 text-purple-600">
          <Sparkles className="h-4 w-4" />
          <span>AI Product Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="product-info" className="text-xs">Product Information</Label>
          <Textarea
            id="product-info"
            value={productInfo}
            onChange={(e) => setProductInfo(e.target.value)}
            placeholder="Describe your product (e.g., 'wireless bluetooth headphones with noise cancellation')"
            className="min-h-16 border-purple-200 focus:border-purple-400 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="tone" className="text-xs">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="border-purple-200 focus:border-purple-400 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tones.map((toneOption) => (
                <SelectItem key={toneOption.value} value={toneOption.value} className="text-sm">
                  {toneOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateContent}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-8 text-xs"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          {loading ? 'Generating...' : 'Generate with AI'}
        </Button>
      </CardContent>
    </Card>
  );
};
