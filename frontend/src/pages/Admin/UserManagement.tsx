import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserCog, Ban, CheckCircle } from "lucide-react";

// Mock users data - replace with actual API call
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    joinedDate: "2024-01-15",
    lastLogin: "2024-03-20",
    role: "USER"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "suspended",
    joinedDate: "2024-02-01",
    lastLogin: "2024-03-18",
    role: "USER"
  },
  // Add more mock users as needed
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === "active" ? "suspended" : "active";
        toast({
          title: `User ${newStatus}`,
          description: `${user.name}'s account has been ${newStatus}.`,
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    
    toast({
      title: "User updated",
      description: `${selectedUser.name}'s information has been updated successfully.`,
    });
    
    setIsEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    
    toast({
      title: "User deleted",
      description: `${selectedUser.name}'s account has been deleted successfully.`,
    });
    
    setIsDeleteDialogOpen(false);
  };

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "success" : "destructive"}
                        className="capitalize"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.status === "active" ? (
                            <Ban className="h-4 w-4 text-destructive" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user information and permissions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUser}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedUser?.name || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedUser?.status}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}'s account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default UserManagement; 