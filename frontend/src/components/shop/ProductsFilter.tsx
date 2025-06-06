import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange?: (sort: string) => void;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
];

const ProductsFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  onSearchChange,
  onSortChange,
  priceRange = [0, 100],
  onPriceRangeChange
}: ProductsFilterProps) => {
  const { data: categories = [], isLoading: isLoadingCategories, error } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [sliderRange, setSliderRange] = useState<[number, number]>(priceRange);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedRating, setSelectedRating] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [tempSelectedRating, setTempSelectedRating] = useState<string[]>([]);
  const [tempSelectedBrands, setTempSelectedBrands] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  const handleApplyFilters = () => {
    if (onPriceRangeChange) {
      onPriceRangeChange(sliderRange);
    }
    setSelectedRating(tempSelectedRating);
    setSelectedBrands(tempSelectedBrands);
    // Here you would typically send these filters to your backend API
    console.log("Applied filters:", { sliderRange, tempSelectedRating, tempSelectedBrands });
  };

  const handleCancelFilters = () => {
    setTempSelectedRating(selectedRating);
    setTempSelectedBrands(selectedBrands);
  };

  const handleRatingChange = (rating: string) => {
    setTempSelectedRating(prev => {
      if (prev.includes(rating)) {
        return prev.filter(r => r !== rating);
      } else {
        return [...prev, rating];
      }
    });
  };

  const handleBrandChange = (brand: string) => {
    setTempSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  // Render category tabs
  const renderCategoryTabs = () => {
    // Always show loading state first
    if (isLoadingCategories) {
      return Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-24 flex-shrink-0" />
      ));
    }

    // If we have an error, show a message
    if (error) {
      console.error('Error loading categories:', error);
      return (
        <div className="text-sm text-red-500">
          Error loading categories
        </div>
      );
    }

    // If we have no categories, show a message
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      console.error('Categories is not a valid array:', categories);
      return (
        <div className="text-sm text-muted-foreground">
          No categories available
        </div>
      );
    }

    // Render the category tabs
    return Array.isArray(categories)
      ? categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0"
          >
            {category.name}
          </TabsTrigger>
        ))
      : null;
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold">Browse Products</h2>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Refine your product search with these filters.
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                {/* Price Range */}
                <div className="space-y-2">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    Price Range
                  </h3>
                  <Slider 
                    max={100} 
                    step={1} 
                    value={sliderRange}
                    onValueChange={(value) => setSliderRange(value as [number, number])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₹0</span>
                    <span>₹{sliderRange[0].toLocaleString('en-IN')} - ₹{sliderRange[1].toLocaleString('en-IN')}</span>
                    <span>₹100,000</span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <Checkbox 
                          id={`rating-${star}`}
                          checked={tempSelectedRating.includes(star.toString())}
                          onCheckedChange={() => handleRatingChange(star.toString())}
                        />
                        <Label htmlFor={`rating-${star}`} className="flex items-center">
                          {star}★ & Above
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Brand */}
                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Brand</h3>
                  <div className="space-y-2">
                    {['Dell', 'HP', 'Lenovo', 'Cisco', 'Apple', 'Samsung'].map((brand) => (
                      <div key={brand} className="flex items-center gap-2">
                        <Checkbox 
                          id={`brand-${brand}`}
                          checked={tempSelectedBrands.includes(brand)}
                          onCheckedChange={() => handleBrandChange(brand)}
                        />
                        <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={handleCancelFilters}>Cancel</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          {/* Sort Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4 text-primary" />
                <span>Sort</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-2">
                <h3 className="font-medium text-sm mb-2">Sort By</h3>
                <RadioGroup value={sortBy} onValueChange={handleSortChange}>
                  {sortOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={onCategoryChange} className="w-full">
        <TabsList className="w-full flex h-auto bg-transparent overflow-x-auto py-2 justify-start gap-2 no-scrollbar">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
            All Products
          </TabsTrigger>
          {renderCategoryTabs()}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProductsFilter;
