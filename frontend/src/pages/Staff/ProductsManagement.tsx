import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { EnrichedProduct } from "@/hooks/useProducts";
import { ProductInput } from "@/api/productsApi";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import useCategories from "@/hooks/useCategories";
import { ProductImagePicker } from "@/components/shop/ProductImagePicker";
import { env } from "@/config/env";

interface ProductFormData {
  id?: number;
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
}

const ProductsManagement = () => {
  const { 
    products, 
    isLoading: isLoadingProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreatingProduct,
    isUpdatingProduct,
    isDeletingProduct 
  } = useProducts();

  const { data: categories = [], isLoading: isLoadingCategories, error: categoriesError } = useCategories();

  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<EnrichedProduct | null>(null);

  const [imageUrl, setImageUrl] = useState("");

  const handleNewProduct = () => {
    setSelectedProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      imageUrl: "",
    });
    setImageUrl("");
    setIsEditDialogOpen(true);
  };

  const handleEditProduct = (product: EnrichedProduct) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.priceNumber.toString(),
      category: product.category || "",
      stock: product.stock.toString(),
      imageUrl: product.image || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteProduct = (product: EnrichedProduct) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Validate required fields
    if (!selectedProduct.name.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProduct.price || isNaN(parseFloat(selectedProduct.price))) {
      toast({
        title: "Error",
        description: "Price must be a valid number",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProduct.stock || isNaN(parseInt(selectedProduct.stock, 10))) {
      toast({
        title: "Error",
        description: "Stock must be a valid number",
        variant: "destructive",
      });
      return;
    }

    const payload: ProductInput = {
      name: selectedProduct.name.trim(),
      description: selectedProduct.description?.trim() || undefined,
      price: parseFloat(selectedProduct.price),
      stock: parseInt(selectedProduct.stock, 10),
      category: selectedProduct.category?.trim() || undefined,
      imageUrl: selectedProduct.imageUrl?.trim() || undefined,
    };

    try {
      if (selectedProduct.id) {
        await updateProduct({ id: selectedProduct.id, productData: payload });
        toast({
          title: "Success",
          description: `${selectedProduct.name} has been updated successfully.`,
        });
      } else {
        await createProduct(payload);
        toast({
          title: "Success",
          description: `${selectedProduct.name} has been added successfully.`,
        });
      }
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      setImageUrl("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${selectedProduct.id ? "update" : "create"} product.`,
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: "Product deleted",
        description: `${productToDelete.name} has been removed successfully.`,
      });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete product. ${error.message || ''}`,
        variant: "destructive",
      });
    }
  };
  
  const isLoading = isLoadingProducts || isCreatingProduct || isUpdatingProduct || isDeletingProduct || isLoadingCategories;

  useEffect(() => {
    if (!isEditDialogOpen) {
      setSelectedProduct(null);
      setImageUrl("");
    }
  }, [isEditDialogOpen]);

  useEffect(() => {
    if (!isDeleteDialogOpen) {
      setProductToDelete(null);
    }
  }, [isDeleteDialogOpen]);

  if (isLoadingProducts) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <p>Loading products...</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Button onClick={handleNewProduct} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {isLoading && !isLoadingProducts && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-[100]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: EnrichedProduct) => (
          <Card key={product.id} className="overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>Category: {product.category || 'N/A'}</CardDescription>
              <CardDescription>Price: {product.displayPriceINR}</CardDescription>
              <CardDescription>Stock: {product.stock}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {product.description}
              </p>
              <div className="flex justify-end space-x-2 mt-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditProduct(product)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive"
                  onClick={() => handleDeleteProduct(product)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-4 sm:p-8 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.id ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {selectedProduct?.id 
                ? "Make changes to the product details below" 
                : "Fill in the details for the new product"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={selectedProduct?.name || ""} 
                  onChange={(e) => setSelectedProduct(prev => prev ? {...prev, name: e.target.value} : null)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (INR)</Label>
                <Input 
                  id="price" 
                  type="number"
                  step="0.01"
                  value={selectedProduct?.price || ""} 
                  onChange={(e) => setSelectedProduct(prev => prev ? {...prev, price: e.target.value} : null)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input 
                  id="stock" 
                  type="number"
                  step="1"
                  value={selectedProduct?.stock || ""} 
                  onChange={(e) => setSelectedProduct(prev => prev ? {...prev, stock: e.target.value} : null)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedProduct?.category || ""}
                  onValueChange={value => setSelectedProduct(prev => prev ? { ...prev, category: value } : null)}
                  disabled={isLoading || isLoadingCategories}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  rows={3}
                  value={selectedProduct?.description || ""} 
                  onChange={(e) => setSelectedProduct(prev => prev ? {...prev, description: e.target.value} : null)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label>Product Image</Label>
                <ProductImagePicker
                  imageUrl={selectedProduct?.imageUrl || ""}
                  setImageUrl={url => setSelectedProduct(prev => prev ? { ...prev, imageUrl: url } : null)}
                  googleClientId={env.google.clientId}
                  googleDeveloperKey={env.google.developerKey}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {selectedProduct?.id ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default ProductsManagement;
