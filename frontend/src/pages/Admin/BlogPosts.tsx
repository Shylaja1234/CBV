import { useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Search, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft';
  author: string;
  publishDate: string;
}

// Mock blog posts
const mockBlogPosts: BlogPost[] = [
  { id: 1, title: "Getting Started with Our Products", slug: "getting-started", category: "Tutorials", status: "published", author: "John Smith", publishDate: "2023-10-15" },
  { id: 2, title: "10 Tips for Better Productivity", slug: "productivity-tips", category: "Business", status: "published", author: "Emily Johnson", publishDate: "2023-10-10" },
  { id: 3, title: "The Future of E-commerce", slug: "future-ecommerce", category: "Industry", status: "published", author: "Michael Brown", publishDate: "2023-09-28" },
  { id: 4, title: "Upcoming Product Features", slug: "upcoming-features", category: "News", status: "draft", author: "Sarah Williams", publishDate: "Not published" },
  { id: 5, title: "Customer Success Stories", slug: "success-stories", category: "Case Studies", status: "published", author: "David Lee", publishDate: "2023-09-15" },
];

const BlogPosts = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    const postTitle = posts.find(p => p.id === id)?.title;
    setPosts(posts.filter(post => post.id !== id));
    
    toast({
      title: "Post deleted",
      description: `"${postTitle}" has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
            <p className="text-muted-foreground">Manage your blog content</p>
          </div>
          <Button asChild>
            <Link to="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search posts..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <CardDescription>Manage your blog posts and articles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{post.publishDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Edit"
                          asChild
                        >
                          <Link to={`/admin/blog/edit/${post.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          title="Delete"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default BlogPosts;
