import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

// Import your components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
// ... other imports

function App() {
  const { error, refreshCart } = useCart();

  // Refresh cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Show error toast if cart operation fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            {/* ... other routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 