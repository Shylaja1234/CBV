import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Edit, ImagePlus, Plus, Save, Trash2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContentSection {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  items?: Array<{
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    price?: string;
  }>;
}

const ContentEditor = () => {
  const { pageId = "home" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [isEditing, setIsEditing] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [currentSection, setCurrentSection] = useState<ContentSection | null>(null);

  // Mock data for each page
  useEffect(() => {
    // This would be replaced with an API call to get the actual content
    let mockData: ContentSection[] = [];
    
    switch (pageId) {
      case "home":
        setPageTitle("Home Page");
        mockData = [
          {
            id: "hero",
            title: "Welcome to Our Company",
            subtitle: "We provide the best services",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            imageUrl: "https://images.unsplash.com/photo-1661956600684-97d3a4320e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          },
          {
            id: "features",
            title: "Our Features",
            content: "Check out what makes us different",
            items: [
              { id: "f1", title: "Quality", description: "We deliver high quality products" },
              { id: "f2", title: "Speed", description: "Fast delivery and service" },
              { id: "f3", title: "Support", description: "24/7 customer support" }
            ]
          }
        ];
        break;
      case "about":
        setPageTitle("About Page");
        mockData = [
          {
            id: "mission",
            title: "Our Mission",
            content: "To provide exceptional service and products to our customers."
          },
          {
            id: "team",
            title: "Our Team",
            content: "Meet our expert team of professionals",
            items: [
              { id: "t1", title: "John Doe", description: "CEO", imageUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
              { id: "t2", title: "Jane Smith", description: "CTO", imageUrl: "https://randomuser.me/api/portraits/women/1.jpg" }
            ]
          }
        ];
        break;
      case "services":
        setPageTitle("Services Page");
        mockData = [
          {
            id: "services-list",
            title: "Our Services",
            content: "Explore our range of services",
            items: [
              { id: "s1", title: "Consulting", description: "Expert advice for your business" },
              { id: "s2", title: "Development", description: "Custom software solutions" },
              { id: "s3", title: "Support", description: "Ongoing technical support" }
            ]
          }
        ];
        break;
      case "products":
        setPageTitle("Products Page");
        mockData = [
          {
            id: "products-list",
            title: "Our Products",
            content: "Browse our selection of products",
            items: [
              { id: "p1", title: "Product A", description: "High quality item", price: "$99.99", imageUrl: "https://placehold.co/400" },
              { id: "p2", title: "Product B", description: "Best seller", price: "$149.99", imageUrl: "https://placehold.co/400" },
              { id: "p3", title: "Product C", description: "New arrival", price: "$199.99", imageUrl: "https://placehold.co/400" }
            ]
          }
        ];
        break;
      case "pricing":
        setPageTitle("Pricing Page");
        mockData = [
          {
            id: "pricing-plans",
            title: "Our Pricing Plans",
            content: "Choose the plan that fits your needs",
            items: [
              { id: "pl1", title: "Basic", description: "For small businesses", price: "$29/month" },
              { id: "pl2", title: "Premium", description: "For growing businesses", price: "$99/month" },
              { id: "pl3", title: "Enterprise", description: "For large organizations", price: "$299/month" }
            ]
          }
        ];
        break;
      case "contact":
        setPageTitle("Contact Page");
        mockData = [
          {
            id: "contact-info",
            title: "Get in Touch",
            content: "Have questions? Contact us!",
            items: [
              { id: "c1", title: "Email", description: "info@example.com" },
              { id: "c2", title: "Phone", description: "+1 (555) 123-4567" },
              { id: "c3", title: "Address", description: "123 Main St, Anytown, USA" }
            ]
          }
        ];
        break;
      default:
        navigate("/admin/dashboard");
        break;
    }
    
    setSections(mockData);
  }, [pageId, navigate]);

  const handleSectionSelect = (section: ContentSection) => {
    setCurrentSection(section);
    setIsEditing(true);
  };

  const handleSectionChange = (field: string, value: string) => {
    if (!currentSection) return;
    
    setCurrentSection({
      ...currentSection,
      [field]: value
    });
  };

  const handleItemChange = (itemId: string, field: string, value: string) => {
    if (!currentSection || !currentSection.items) return;
    
    const updatedItems = currentSection.items.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setCurrentSection({
      ...currentSection,
      items: updatedItems
    });
  };

  const handleAddItem = () => {
    if (!currentSection) return;
    
    const newId = `new-${Date.now()}`;
    const newItem = { id: newId, title: "New Item" };
    
    setCurrentSection({
      ...currentSection,
      items: [...(currentSection.items || []), newItem]
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!currentSection || !currentSection.items) return;
    
    const updatedItems = currentSection.items.filter(item => item.id !== itemId);
    
    setCurrentSection({
      ...currentSection,
      items: updatedItems
    });
  };

  const handleSave = () => {
    if (!currentSection) return;
    
    // Update the sections array with the edited section
    const updatedSections = sections.map(section => {
      if (section.id === currentSection.id) {
        return currentSection;
      }
      return section;
    });
    
    setSections(updatedSections);
    setIsEditing(false);
    
    // In a real app, you'd save to a database here
    toast({
      title: "Changes saved",
      description: "Your content has been updated successfully.",
    });
  };

  const handleAddSection = () => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      content: "Add your content here"
    };
    
    setSections([...sections, newSection]);
    setCurrentSection(newSection);
    setIsEditing(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
    
    if (currentSection && currentSection.id === sectionId) {
      setCurrentSection(null);
      setIsEditing(false);
    }
    
    toast({
      title: "Section deleted",
      description: "The section has been removed.",
    });
  };

  const handlePublish = () => {
    // In a real app, this would push changes to the live site
    toast({
      title: "Changes published",
      description: "Your content is now live on the website.",
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
            <p className="text-muted-foreground">Edit your page content and layout</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePublish}>
              <Check className="mr-2 h-4 w-4" />
              Publish Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sections List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Sections</CardTitle>
                  <CardDescription>Manage page sections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        currentSection?.id === section.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleSectionSelect(section)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{section.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddSection} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </CardFooter>
              </Card>

              {/* Section Editor */}
              {currentSection && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Edit Section</CardTitle>
                    <CardDescription>Modify section content and properties</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={currentSection.title}
                        onChange={(e) => handleSectionChange("title", e.target.value)}
                      />
                    </div>
                    {currentSection.subtitle !== undefined && (
                      <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                          id="subtitle"
                          value={currentSection.subtitle || ""}
                          onChange={(e) => handleSectionChange("subtitle", e.target.value)}
                        />
                      </div>
                    )}
                    {currentSection.content !== undefined && (
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={currentSection.content || ""}
                          onChange={(e) => handleSectionChange("content", e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}
                    {currentSection.imageUrl !== undefined && (
                      <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="flex items-center gap-4">
                          {currentSection.imageUrl && (
                            <img
                              src={currentSection.imageUrl}
                              alt="Section"
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <Button variant="outline">
                            <ImagePlus className="mr-2 h-4 w-4" />
                            {currentSection.imageUrl ? "Change Image" : "Add Image"}
                          </Button>
                        </div>
                      </div>
                    )}
                    {currentSection.items && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Items</Label>
                          <Button variant="outline" size="sm" onClick={handleAddItem}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {currentSection.items.map((item) => (
                            <Card key={item.id}>
                              <CardHeader className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2 flex-1">
                                    <Input
                                      value={item.title}
                                      onChange={(e) =>
                                        handleItemChange(item.id, "title", e.target.value)
                                      }
                                      placeholder="Item Title"
                                    />
                                    {item.description !== undefined && (
                                      <Input
                                        value={item.description || ""}
                                        onChange={(e) =>
                                          handleItemChange(item.id, "description", e.target.value)
                                        }
                                        placeholder="Description"
                                      />
                                    )}
                                    {item.price !== undefined && (
                                      <Input
                                        value={item.price || ""}
                                        onChange={(e) =>
                                          handleItemChange(item.id, "price", e.target.value)
                                        }
                                        placeholder="Price"
                                      />
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your page for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input id="meta-title" placeholder="Page title for search engines" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    placeholder="Brief description of the page"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
                <CardDescription>Configure page properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input id="slug" value={pageId} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input id="status" value="Published" disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default ContentEditor;
