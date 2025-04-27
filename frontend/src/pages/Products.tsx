import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsFilter from "@/components/shop/ProductsFilter";
import ProductGrid from "@/components/shop/ProductGrid";
import { Separator } from "@/components/ui/separator";
import useProducts from "@/hooks/useProducts";
import { setPageTitle } from "@/utils/title";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  
  // Use our custom hook to fetch products
  const { products, isLoading, totalProducts, refetch } = useProducts({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchTerm,
    sortBy: sortBy
  });
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageTitle("Products");
  }, []);
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <section className="py-12">
            <div className="container px-4 mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold">IT Products</h1>
                  <div className="text-muted-foreground">
                    Showing {products.length} products
                  </div>
                </div>
                
                <Separator className="mb-8" />
                
                <ProductsFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  onSearchChange={setSearchTerm}
                  onSortChange={setSortBy}
                />
                
                <ProductGrid products={products} isLoading={isLoading} />
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProductsPage;
