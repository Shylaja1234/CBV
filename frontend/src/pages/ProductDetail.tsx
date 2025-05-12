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
import { fetchProductById, BackendProduct } from "@/api/productsApi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/shared/PageTransition";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<BackendProduct | null>(null);
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
        const response = await fetchProductById(Number(id));
        setProduct(response.data);
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
    
    if (product.stock <= 0) {
      toast.error("Sorry, this item is out of stock.");
      return;
    }
    
    const cartItem: CartItem = {
      id: product.id,
      title: product.name,
      price: `₹${Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      quantity: 1,
      image: "",
      category: product.category || "Unknown Category"
    };
    
    addToCart(cartItem);
    toast.success(`${product.name} added to cart`);
  };
  
  const increaseQuantity = () => {
    if (!product || product.stock <= 0) return;
    updateQuantity(Number(id), quantity + 1);
    toast.success(`Added one more ${product.name}`);
  };
  
  const decreaseQuantity = () => {
    if (!product) return;
    
    if (quantity > 1) {
      updateQuantity(Number(id), quantity - 1);
    } else if (quantity === 1) {
      removeFromCart(Number(id));
      toast.info(`${product.name} removed from cart`);
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
              <div className="relative rounded-xl overflow-hidden border bg-card aspect-square flex items-center justify-center">
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <Badge variant="destructive" className="text-base px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
                <img 
                  src={product.imageUrl || "https://via.placeholder.com/600x600.png?text=Product+Image"}
                  alt={product.name}
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
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  <h2 className="text-2xl font-semibold">{`₹${Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h2>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                
                <Separator />
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Stock:</span>
                    <span>{product.stock > 0 ? product.stock : "Out of Stock"}</span>
                  </div>
                  {quantity > 0 ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="icon" variant="outline" onClick={decreaseQuantity} disabled={quantity === 0}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                      <Button size="icon" variant="outline" onClick={increaseQuantity} disabled={product.stock <= quantity}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="flex-grow md:flex-grow-0 mt-2"
                      disabled={product.stock <= 0}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  )}
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
