import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000'; // Update this if your backend runs on a different port

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
); 