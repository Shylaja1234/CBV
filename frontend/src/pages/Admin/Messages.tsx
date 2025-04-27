
import { useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye, Mail, MailCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'read' | 'unread';
  date: string;
}

// Mock contact messages
const mockMessages: ContactMessage[] = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john@example.com", 
    subject: "Product Inquiry", 
    message: "I'm interested in your services and would like to know more about pricing options. Could you please send me a detailed breakdown?",
    status: "unread", 
    date: "2023-10-15 14:30" 
  },
  { 
    id: 2, 
    name: "Emily Johnson", 
    email: "emily@example.com", 
    subject: "Support Request", 
    message: "I'm having trouble with my recent purchase. The product isn't working as expected. Here are the details of the issue I'm experiencing...",
    status: "read", 
    date: "2023-10-12 09:15" 
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    email: "michael@example.com", 
    subject: "Partnership Opportunity", 
    message: "I represent XYZ Corp and we're interested in discussing a potential partnership with your company. Please let me know when we can schedule a call.",
    status: "unread", 
    date: "2023-10-10 16:45" 
  },
  { 
    id: 4, 
    name: "Sarah Williams", 
    email: "sarah@example.com", 
    subject: "Feedback on Website", 
    message: "I've been exploring your website and wanted to provide some feedback. I found the navigation intuitive, but had some suggestions for improvement.",
    status: "read", 
    date: "2023-10-08 11:20" 
  },
  { 
    id: 5, 
    name: "David Lee", 
    email: "david@example.com", 
    subject: "Job Application Follow-up", 
    message: "I submitted my application for the Marketing Manager position last week and wanted to follow up on the status of my application. I'm very interested in the role.",
    status: "unread", 
    date: "2023-10-05 13:50" 
  },
];

const Messages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAsRead = (id: number) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, status: "read" } 
        : message
    ));
    
    toast({
      title: "Message marked as read",
      description: "This message has been marked as read.",
    });
  };

  const handleDelete = (id: number) => {
    setMessages(messages.filter(message => message.id !== id));
    
    toast({
      title: "Message deleted",
      description: "The message has been removed from your inbox.",
      variant: "destructive",
    });
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
    
    // Mark as read if it was unread
    if (message.status === "unread") {
      handleMarkAsRead(message.id);
    }
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <PageTransition>
      <AdminLayout>
        <div className="p-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Contact Messages</h1>
              <p className="text-muted-foreground">
                Manage inquiries from your contact form 
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>Messages received from visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message.id} className={message.status === "unread" ? "bg-muted/30 font-medium" : ""}>
                      <TableCell>
                        <Badge variant={message.status === "unread" ? "secondary" : "outline"}>
                          {message.status === "unread" ? "Unread" : "Read"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{message.name}</div>
                          <div className="text-sm text-muted-foreground">{message.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>{message.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title="View"
                            onClick={() => handleViewMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {message.status === "unread" && (
                            <Button
                              variant="outline"
                              size="icon"
                              title="Mark as read"
                              onClick={() => handleMarkAsRead(message.id)}
                            >
                              <MailCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            title="Delete"
                            onClick={() => handleDelete(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMessages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Mail className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No messages found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Message Viewing Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedMessage?.subject}</DialogTitle>
                <DialogDescription>
                  From: {selectedMessage?.name} ({selectedMessage?.email}) • {selectedMessage?.date}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 p-4 bg-muted/30 rounded-md">
                <p className="whitespace-pre-line">{selectedMessage?.message}</p>
              </div>
              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Reply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </PageTransition>
  );
};

export default Messages;
