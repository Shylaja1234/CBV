import { useState } from "react";
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
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";

const ProductsManagement = () => {
  const { products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleNewProduct = () => {
    setSelectedProduct({
      title: "",
      description: "",
      price: "",
      category: "",
      image: ""
    });
    setIsEditDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: selectedProduct.id ? "Product updated" : "Product created",
      description: `${selectedProduct.title} has been ${selectedProduct.id ? "updated" : "added"} successfully.`,
    });
    
    setIsEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    toast({
      title: "Product deleted",
      description: `${selectedProduct.title} has been removed successfully.`,
    });
    
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
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
        <Button onClick={handleNewProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{product.title}</CardTitle>
              <CardDescription>{product.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditProduct(product)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteProduct(product)}
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
        <DialogContent className="max-w-md">
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
                <Label htmlFor="title">Product Title</Label>
                <Input 
                  id="title" 
                  value={selectedProduct?.title || ""} 
                  onChange={(e) => setSelectedProduct({...selectedProduct, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  value={selectedProduct?.price || ""} 
                  onChange={(e) => setSelectedProduct({...selectedProduct, price: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={selectedProduct?.category || ""} 
                  onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  rows={3}
                  value={selectedProduct?.description || ""} 
                  onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Product Image</Label>
                {selectedProduct?.image ? (
                  <div className="relative bg-muted rounded-md overflow-hidden">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.title} 
                      className="w-full h-40 object-cover"
                    />
                    <Button 
                      type="button"
                      variant="secondary" 
                      size="sm" 
                      className="absolute bottom-2 right-2"
                      onClick={() => setSelectedProduct({...selectedProduct, image: ""})}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <ImagePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload an image
                    </p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default ProductsManagement;
