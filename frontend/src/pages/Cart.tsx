
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus, X, ArrowLeft, ShoppingBag, CreditCard, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/products");
      setIsCheckingOut(false);
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="container px-4 mx-auto py-12">
            <Link to="/products">
              <Button variant="outline" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                      <ShoppingBag className="h-6 w-6" />
                      Shopping Cart ({itemCount})
                    </h1>
                    {items.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearCart}>
                        Clear Cart
                      </Button>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
                      <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
                      <Link to="/products">
                        <Button>Browse Products</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-6 border-b">
                          <Link to={`/products/${item.id}`} className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </Link>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <Link to={`/products/${item.id}`}>
                                <h3 className="font-medium hover:text-primary transition-colors line-clamp-1">
                                  {item.title}
                                </h3>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">{item.category}</p>
                            <div className="flex justify-between items-end">
                              <div className="flex items-center border rounded-md">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateQuantity(item.id, item.quantity - 1);
                                    } else {
                                      removeFromCart(item.id);
                                      toast.info(`${item.title} removed from cart`);
                                    }
                                  }}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{item.price}</div>
                                <div className="text-sm text-muted-foreground">
                                  {item.quantity > 1 ? `${item.quantity} × ${item.price}` : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{cartTotal > 0 ? (cartTotal >= 10000 ? 'Free' : '₹500') : '₹0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{cartTotal > 0 ? Math.round(cartTotal * 0.18).toLocaleString('en-IN') : '0'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>
                        ₹{cartTotal > 0 
                          ? (cartTotal + (cartTotal >= 10000 ? 0 : 500) + Math.round(cartTotal * 0.18)).toLocaleString('en-IN') 
                          : '0'}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      disabled={items.length === 0 || isCheckingOut}
                      onClick={handleCheckout}
                    >
                      {isCheckingOut ? (
                        <>Processing...</>
                      ) : !isAuthenticated ? (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Login to Checkout
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Checkout
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CartPage;
