import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus, X, ArrowLeft, ShoppingBag, CreditCard, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { userApi } from "@/api/userApi";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch addresses on mount
  useEffect(() => {
    if (isAuthenticated) {
      setAddressLoading(true);
      userApi.getAddresses().then(setAddresses).finally(() => setAddressLoading(false));
    }
  }, [isAuthenticated]);

  // Razorpay handler
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }
    setPaymentLoading(true);
    try {
      // Calculate total in paise
      const subtotal = cartTotal;
      const shipping = subtotal >= 10000 ? 0 : 500;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + shipping + tax;
      const totalPaise = total * 100;
      // Create Razorpay order
      const razorpayOrder = await userApi.createRazorpayOrder(totalPaise);
      // Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "ConnectingBee",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          // On payment success, verify and create order
          try {
            await userApi.checkout({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: items.map(i => ({ productId: i.id, name: i.title, price: i.price, quantity: i.quantity })),
              total: razorpayOrder.amount,
              addressId: selectedAddressId,
            });
            toast.success("Order placed successfully!");
            clearCart();
            navigate("/profile?tab=orders");
          } catch (err) {
            toast.error("Payment succeeded but order creation failed. Contact support.");
          }
        },
        prefill: {},
        theme: { color: "#0f172a" },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to initiate payment. Try again.");
    } finally {
      setPaymentLoading(false);
    }
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
                  {isAuthenticated && (
                    <div className="mt-8">
                      <h2 className="font-semibold mb-2">Select Delivery Address</h2>
                      {addressLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : addresses.length === 0 ? (
                        <div>No addresses found. Please add one in your profile.</div>
                      ) : (
                        <ul className="space-y-2">
                          {addresses.map(addr => (
                            <li key={addr.id} className={`border rounded p-2 flex items-center gap-2 ${selectedAddressId === addr.id ? 'border-primary' : ''}`}> 
                              <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} />
                              <div>
                                <div><b>{addr.name}</b> ({addr.phone})</div>
                                <div>{addr.address1}, {addr.address2 && addr.address2 + ', '}{addr.city}, {addr.state} - {addr.pincode}, {addr.country}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
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
                      disabled={items.length === 0 || paymentLoading}
                      onClick={handleCheckout}
                    >
                      {paymentLoading ? (
                        <>Processing...</>
                      ) : !isAuthenticated ? (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Login to Checkout
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay & Checkout
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
