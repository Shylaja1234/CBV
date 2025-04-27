
import { useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Upload, Folder, Search, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// Mock media items for demo
const mockMediaItems = [
  { id: 1, name: "hero-image.jpg", type: "image", url: "https://images.unsplash.com/photo-1661956600684-97d3a4320e45", size: "1.2 MB", createdAt: "2023-10-15" },
  { id: 2, name: "product-1.jpg", type: "image", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", size: "0.8 MB", createdAt: "2023-10-12" },
  { id: 3, name: "team-member.jpg", type: "image", url: "https://randomuser.me/api/portraits/men/1.jpg", size: "0.5 MB", createdAt: "2023-10-10" },
  { id: 4, name: "banner.jpg", type: "image", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", size: "1.5 MB", createdAt: "2023-10-05" },
  { id: 5, name: "company-logo.svg", type: "svg", url: "https://placehold.co/200", size: "0.1 MB", createdAt: "2023-09-28" },
  { id: 6, name: "document.pdf", type: "document", url: "#", size: "2.3 MB", createdAt: "2023-09-20" },
];

const MediaLibrary = () => {
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState(mockMediaItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const filteredItems = mediaItems.filter(item => {
    // Filter by search query
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab selection
    const matchesTab = activeTab === "all" || item.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleUpload = () => {
    toast({
      title: "Upload successful",
      description: "Your file has been uploaded to the media library.",
    });
  };

  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDelete = () => {
    setMediaItems(mediaItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    toast({
      title: "Items deleted",
      description: `${selectedItems.length} item(s) have been deleted.`,
    });
  };

  return (
    <PageTransition>
      <AdminLayout>
        <div className="p-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Media Library</h1>
              <p className="text-muted-foreground">Manage your images, videos, and documents</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Media</DialogTitle>
                    <DialogDescription>
                      Upload images, videos, documents, or other media files to your library.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supports images, videos, PDFs, and documents up to 10MB</p>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleUpload}>Upload</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {selectedItems.length > 0 && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedItems.length})
                </Button>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search media..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="document">Documents</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Media Files</span>
                <span className="text-sm font-normal text-muted-foreground">{filteredItems.length} items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredItems.length === 0 ? (
                <div className="text-center py-10">
                  <Image className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No media files found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        selectedItems.includes(item.id) ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleSelect(item.id)}
                    >
                      <div className="relative aspect-square bg-muted/50">
                        {item.type === "image" || item.type === "svg" ? (
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Folder className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="font-medium truncate text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} • {item.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Load More</Button>
            </CardFooter>
          </Card>
        </div>
      </AdminLayout>
    </PageTransition>
  );
};

export default MediaLibrary;
