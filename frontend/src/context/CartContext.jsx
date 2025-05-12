import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch cart items');
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to add items to cart');
      }

      const response = await axios.post('/api/cart/add', 
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to update cart');
      }

      const response = await axios.put(`/api/cart/items/${cartItemId}`,
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to remove items from cart');
      }

      await axios.delete(`/api/cart/items/${cartItemId}`, {
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to clear cart');
      }

      await axios.delete('/api/cart/clear', {
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
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 