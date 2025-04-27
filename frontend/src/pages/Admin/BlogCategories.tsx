import { useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for blog categories
const mockCategories = [
  { id: 1, name: "Technology", slug: "technology", postCount: 8 },
  { id: 2, name: "Business", slug: "business", postCount: 5 },
  { id: 3, name: "Design", slug: "design", postCount: 3 },
  { id: 4, name: "Marketing", slug: "marketing", postCount: 6 },
  { id: 5, name: "Development", slug: "development", postCount: 12 },
];

const BlogCategories = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAddCategory = () => {
    const id = Math.max(0, ...categories.map(c => c.id)) + 1;
    setCategories([...categories, { ...newCategory, id, postCount: 0 }]);
    setNewCategory({ name: "", slug: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = () => {
    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id ? selectedCategory : cat
    ));
    setIsEditDialogOpen(false);
  };

  const handleDeleteCategory = () => {
    setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
    setIsDeleteDialogOpen(false);
  };

  const handleSlugChange = (value: string, isNew = false) => {
    const slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    if (isNew) {
      setNewCategory({ ...newCategory, slug });
    } else {
      setSelectedCategory({ ...selectedCategory, slug });
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blog Categories</h2>
            <p className="text-muted-foreground">Manage the categories for your blog posts.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for your blog posts.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input 
                    id="name" 
                    value={newCategory.name} 
                    onChange={(e) => {
                      setNewCategory({ ...newCategory, name: e.target.value });
                      handleSlugChange(e.target.value, true);
                    }}
                    placeholder="Category name" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                  <Input 
                    id="slug" 
                    value={newCategory.slug} 
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="category-slug" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCategory}>Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Slug</TableHead>
                  <TableHead className="hidden md:table-cell">Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{category.postCount} posts</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No categories found. Create your first category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details.
              </DialogDescription>
            </DialogHeader>
            {selectedCategory && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                  <Input 
                    id="edit-name" 
                    value={selectedCategory.name} 
                    onChange={(e) => {
                      setSelectedCategory({ ...selectedCategory, name: e.target.value });
                      handleSlugChange(e.target.value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-slug" className="text-sm font-medium">Slug</label>
                  <Input 
                    id="edit-slug" 
                    value={selectedCategory.slug} 
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, slug: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditCategory}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action cannot be undone.
                {selectedCategory && selectedCategory.postCount > 0 && (
                  <p className="text-destructive mt-2">
                    Warning: This category contains {selectedCategory.postCount} posts. 
                    These posts will be uncategorized if you delete this category.
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>Delete Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default BlogCategories;
