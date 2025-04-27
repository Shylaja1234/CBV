
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Plus, Minus, X, ShoppingBag } from "lucide-react";

const CartSheet = () => {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        variant="outline" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-muted-foreground mt-1 mb-6">Start adding items to your cart!</p>
              <SheetClose asChild>
                <Button>Continue Shopping</Button>
              </SheetClose>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-2 border-b">
                  <Link to={`/products/${item.id}`} className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-grow">
                    <Link to={`/products/${item.id}`}>
                      <h4 className="font-medium line-clamp-1 hover:text-primary transition-colors">{item.title}</h4>
                    </Link>
                    <div className="text-muted-foreground text-sm">{item.price}</div>
                    <div className="flex items-center mt-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          } else {
                            removeFromCart(item.id);
                          }
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground self-start"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {items.length > 0 && (
          <SheetFooter className="border-t pt-4 flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => clearCart()}>
                Clear Cart
              </Button>
              <SheetClose asChild>
                <Button asChild>
                  <Link to="/cart">View Cart</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
