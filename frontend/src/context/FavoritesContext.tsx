
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: number[];
  addToFavorites: (productId: number) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on mount or when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedFavorites = localStorage.getItem(`favorites-${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      // Clear favorites if not authenticated
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`favorites-${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated, user]);

  const addToFavorites = (productId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }
    
    if (!favorites.includes(productId)) {
      setFavorites((prev) => [...prev, productId]);
      toast.success("Added to favorites");
    }
  };

  const removeFromFavorites = (productId: number) => {
    if (!isAuthenticated) {
      return;
    }
    
    setFavorites((prev) => prev.filter((id) => id !== productId));
    toast.info("Removed from favorites");
  };

  const isFavorite = (productId: number) => {
    return favorites.includes(productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
