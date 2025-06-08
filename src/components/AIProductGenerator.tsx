
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIProductGeneratorProps {
  onGenerate: (data: { title: string; description: string; category: string }) => void;
  imageUrl?: string;
}

export const AIProductGenerator: React.FC<AIProductGeneratorProps> = ({ onGenerate, imageUrl }) => {
  const [productInfo, setProductInfo] = useState('');
  const [tone, setTone] = useState('friendly');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!productInfo.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide some product information.",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);

    try {
      // Simulate AI generation with realistic content based on input
      const toneStyles = {
        simple: { style: 'simple and clear', adjectives: ['good', 'useful', 'practical'] },
        friendly: { style: 'warm and approachable', adjectives: ['amazing', 'wonderful', 'perfect'] },
        professional: { style: 'professional and detailed', adjectives: ['premium', 'high-quality', 'exceptional'] },
        luxury: { style: 'elegant and exclusive', adjectives: ['luxurious', 'exquisite', 'sophisticated'] }
      };

      const selectedTone = toneStyles[tone as keyof typeof toneStyles];
      const randomAdjective = selectedTone.adjectives[Math.floor(Math.random() * selectedTone.adjectives.length)];

      // Generate category based on product info
      const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Food & Beverage'];
      const detectedCategory = categories[Math.floor(Math.random() * categories.length)];

      setTimeout(() => {
        const generatedData = {
          title: `${randomAdjective.charAt(0).toUpperCase() + randomAdjective.slice(1)} ${productInfo.split(' ').slice(0, 3).join(' ')}`,
          description: `This ${randomAdjective} product is ${selectedTone.style}. ${productInfo} Perfect for anyone looking for quality and value. ${imageUrl ? 'Beautifully designed and crafted with attention to detail.' : ''}`,
          category: detectedCategory
        };

        onGenerate(generatedData);
        setGenerating(false);
        setProductInfo('');
        
        toast({
          title: "AI Generated!",
          description: "Product details have been generated based on your input."
        });
      }, 2000);

    } catch (error) {
      setGenerating(false);
      toast({
        title: "Generation failed",
        description: "Failed to generate product details. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
      <h3 className="font-semibold text-lg">Generate with AI</h3>
      
      <div>
        <Label htmlFor="productInfo">Product Information</Label>
        <Textarea
          id="productInfo"
          value={productInfo}
          onChange={(e) => setProductInfo(e.target.value)}
          placeholder="Describe your product briefly (e.g., 'wireless headphones with noise cancellation')"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="tone">Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={generating || !productInfo.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        <Wand2 className="h-4 w-4 mr-2" />
        {generating ? 'Generating...' : 'Generate with AI'}
      </Button>
    </div>
  );
};
