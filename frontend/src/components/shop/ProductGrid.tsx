import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Plus, Minus } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EnrichedProduct } from "@/hooks/useProducts";

interface ProductGridProps {
  products: EnrichedProduct[];
  isLoading?: boolean;
}

const ProductGrid = ({ products, isLoading = false }: ProductGridProps) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  
  const getCartItem = (productId: number) => {
    if (!Array.isArray(items)) return undefined;
    return items.find(item => item.productId === productId);
  };
  const getCartItemQuantity = (productId: number) => {
    const item = getCartItem(productId);
    return item ? item.quantity : 0;
  };
  
  const handleAddToCart = (product: EnrichedProduct) => {
    if (!product.inStock) {
      toast.error("Sorry, this item is out of stock.");
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };
  
  const increaseQuantity = (product: EnrichedProduct) => {
    if (!product.inStock) return;
    const cartItem = getCartItem(product.id);
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
      toast.success(`Added one more ${product.name}`);
    } else {
      handleAddToCart(product);
    }
  };
  
  const decreaseQuantity = (product: EnrichedProduct) => {
    const cartItem = getCartItem(product.id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      } else if (cartItem.quantity === 1) {
        removeFromCart(cartItem.id);
        toast.info(`${product.name} removed from cart`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-card rounded-xl border shadow-sm h-96 animate-pulse"
          >
            <div className="h-52 bg-muted rounded-t-xl"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="flex justify-between pt-4">
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-10 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-12 border rounded-lg bg-card/50">
        <div className="space-y-4">
          <h3 className="text-xl font-medium">No products match your criteria</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product: EnrichedProduct) => {
        const quantity = getCartItemQuantity(product.id);
        
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: product.id * 0.05 % 0.5 }}
            className="group overflow-hidden flex flex-col bg-card rounded-xl border shadow-sm"
          >
            <div className="relative h-52 overflow-hidden">
              {product.featured && (
                <Badge className="absolute top-2 right-2 z-10">
                  Featured
                </Badge>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <Badge variant="destructive" className="text-sm px-3 py-1">
                    Out of Stock
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-[1]" />
              <img 
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => { e.currentTarget.src = "/placeholder.svg"; }}
              />
              <div className="absolute top-2 left-2 z-10">
                {product.icon && <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                  <product.icon className="h-5 w-5 text-primary" />
                </div>}
              </div>
            </div>
            
            <div className="flex-grow p-4">
              <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-end justify-between">
                <span className="font-semibold text-lg">{product.displayPriceINR}</span>
                <div className="flex space-x-2">
                  <Link 
                    to={`/products/${product.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "flex items-center gap-1"
                    )}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:inline-block">Details</span>
                  </Link>
                  
                  {quantity > 0 ? (
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none"
                        onClick={() => decreaseQuantity(product)}
                        disabled={!product.inStock}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-2 text-sm font-medium">{quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none"
                        onClick={() => increaseQuantity(product)}
                        disabled={!product.inStock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:inline-block">Add</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
