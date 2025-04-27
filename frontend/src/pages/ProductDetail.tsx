
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart, CartItem } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { fetchProductById } from "@/api/productsApi";
import { Product } from "@/data/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/shared/PageTransition";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, items, updateQuantity } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  
  // Get the item quantity from cart if it exists
  const cartItem = items.find(item => item.id === Number(id));
  const quantity = cartItem ? cartItem.quantity : 0;
  const productId = Number(id);
  const isFavorited = isFavorite(productId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Fetch the product details using the API
        const productData = await fetchProductById(Number(id));
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!product.inStock) {
      toast.error("Sorry, this item is out of stock.");
      return;
    }
    
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    };
    
    addToCart(cartItem);
    toast.success(`${product.title} added to cart`);
  };
  
  const increaseQuantity = () => {
    if (!product || !product.inStock) return;
    updateQuantity(Number(id), quantity + 1);
    toast.success(`Added one more ${product.title}`);
  };
  
  const decreaseQuantity = () => {
    if (!product) return;
    
    if (quantity > 1) {
      // Decrease quantity
      updateQuantity(Number(id), quantity - 1);
    } else if (quantity === 1) {
      // Remove from cart when quantity becomes 0
      removeFromCart(Number(id));
      toast.info(`${product.title} removed from cart`);
    }
  };

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: location.pathname } } });
      return;
    }

    if (isFavorited) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24">
            <div className="container px-4 mx-auto py-12">
              <div className="h-96 animate-pulse bg-card rounded-xl"></div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24">
            <div className="container px-4 mx-auto py-12 text-center">
              <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
              <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/products")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="container px-4 mx-auto py-12">
            <Button 
              variant="outline" 
              onClick={() => navigate("/products")}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative rounded-xl overflow-hidden border bg-card aspect-square">
                {product.featured && (
                  <Badge className="absolute top-4 right-4 z-10">
                    Featured
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <Badge variant="destructive" className="text-base px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute top-4 left-4 bg-background/80 rounded-full ${
                    isFavorited ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <product.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  <h2 className="text-2xl font-semibold">{product.price}</h2>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                
                {product.features && (
                  <div>
                    <h3 className="font-medium mb-2">Features</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex flex-wrap gap-4">
                  {quantity > 0 ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-none"
                          onClick={decreaseQuantity}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-4 text-lg font-medium">{quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-none"
                          onClick={increaseQuantity}
                          disabled={!product.inStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="outline"
                        className="flex items-center gap-2" 
                        onClick={() => removeFromCart(product.id)}
                      >
                        Remove from Cart
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="flex-grow md:flex-grow-0"
                      disabled={!product.inStock}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className={`flex-grow md:flex-grow-0 ${isFavorited ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
