
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { fetchProductsMock } from "@/api/productsApi";

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/favorites" } } });
    }
  }, [isAuthenticated, navigate]);

  // Load favorite products
  useEffect(() => {
    const loadFavoriteProducts = async () => {
      try {
        setLoading(true);
        const { products } = await fetchProductsMock();
        const filteredProducts = products.filter(product => 
          favorites.includes(product.id)
        );
        setFavoriteProducts(filteredProducts);
      } catch (error) {
        console.error("Error loading favorite products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && favorites.length > 0) {
      loadFavoriteProducts();
    } else {
      setFavoriteProducts([]);
      setLoading(false);
    }
  }, [favorites, isAuthenticated]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="container px-4 mx-auto py-12">
            <div className="flex items-center justify-between mb-8">
              <Link to="/products">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">My Favorites</h1>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 animate-pulse bg-card rounded-xl"></div>
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
                <p className="text-muted-foreground mb-6">Products you favorite will appear here</p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                    <div className="relative">
                      <Link to={`/products/${product.id}`}>
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 bg-white/80 rounded-full"
                        onClick={() => removeFromFavorites(product.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                      {product.featured && (
                        <Badge className="absolute top-2 left-2">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mb-2">{product.category}</p>
                      <p className="font-semibold">{product.price}</p>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default FavoritesPage;
