import { useState, useEffect } from "react";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye, Mail, MailCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import api from '@/lib/axios';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'read' | 'unread';
  date: string;
}

const Messages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const response = await api.get('/api/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to fetch messages.');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const filteredMessages = Array.isArray(messages) ? messages.filter(message => 
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleMarkAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await api.patch(`/api/messages/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.map(message =>
        message.id === id ? { ...message, status: "read" } : message
      ));
      toast({
        title: "Message marked as read",
        description: "This message has been marked as read.",
      });
    } catch {
      toast({ title: "Error", description: "Failed to mark as read." });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await api.delete(`/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.filter(message => message.id !== id));
      toast({
        title: "Message deleted",
        description: "The message has been removed from your inbox.",
        variant: "destructive",
      });
    } catch {
      toast({ title: "Error", description: "Failed to delete message." });
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
    if (message.status === "unread") {
      handleMarkAsRead(message.id);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const token = localStorage.getItem('authToken');
      await api.post(`/api/messages/${selectedMessage.id}/reply`, {
        reply: replyText.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Reply sent", description: "Your reply has been sent to the user." });
      setReplying(false);
      setReplyText("");
    } catch {
      toast({ title: "Error", description: "Failed to send reply." });
    } finally {
      setSendingReply(false);
    }
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <PageTransition>
      <div className="p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Contact Messages</h1>
            <p className="text-muted-foreground">
              Manage inquiries from your contact form
            </p>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
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
            {loading ? (
              <div className="flex justify-center items-center py-12">Loading messages...</div>
            ) : error ? (
              <div className="text-center text-destructive py-8">{error}</div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No messages found.</div>
            ) : (
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
                            title="Delete"
                            onClick={() => handleDelete(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        {/* View Message Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>View Message</DialogTitle>
              <DialogDescription>
                {selectedMessage && (
                  <>
                    <div><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</div>
                    <div><strong>Subject:</strong> {selectedMessage.subject}</div>
                    <div><strong>Date:</strong> {selectedMessage.date}</div>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedMessage?.message}
            </div>
            {replying ? (
              <div className="space-y-2">
                <textarea
                  className="w-full border rounded p-2 min-h-[80px] text-foreground bg-background"
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  disabled={sendingReply}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setReplying(false)} disabled={sendingReply}>Cancel</Button>
                  <Button onClick={handleSendReply} disabled={sendingReply || !replyText.trim()}>{sendingReply ? "Sending..." : "Send"}</Button>
                </div>
              </div>
            ) : (
              <DialogFooter>
                <Button onClick={() => setReplying(true)}>Reply</Button>
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Messages;
