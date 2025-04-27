
import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: string;
  quantity: number;
  image: string;
  category: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Calculate total price and item count whenever the cart changes
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return sum + (price * item.quantity);
    }, 0);
    
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setItemCount(count);
  }, [items]);

  const addToCart = (product: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists in cart, update quantity
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
