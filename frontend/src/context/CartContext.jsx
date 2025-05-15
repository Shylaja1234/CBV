import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const response = await api.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.error || 'Failed to fetch cart items');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount and when token changes
  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please login to add items to cart');
      }

      const response = await api.post('/api/cart/add', 
        { productId: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.productId === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.productId === product.id ? response.data : item
          );
        }
        return [...prevItems, response.data];
      });
      setError(null);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.response?.data?.error || 'Failed to add item to cart');
      throw err;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please login to update cart');
      }

      const response = await api.put(`/api/cart/items/${cartItemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartItemId ? response.data : item
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error updating cart:', err);
      setError(err.response?.data?.error || 'Failed to update cart');
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please login to remove items from cart');
      }

      await api.delete(`/api/cart/items/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCartItems(prevItems =>
        prevItems.filter(item => item.id !== cartItemId)
      );
      setError(null);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err.response?.data?.error || 'Failed to remove item from cart');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please login to clear cart');
      }

      await api.delete('/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCartItems([]);
      setError(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.response?.data?.error || 'Failed to clear cart');
      throw err;
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const value = {
    items: cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal: getTotalPrice(),
    itemCount: getTotalItems(),
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 