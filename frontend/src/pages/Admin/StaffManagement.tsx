import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Loader2, Search, UserPlus, Edit, Trash2 } from "lucide-react";
import { staffApi, StaffMember, CreateStaffData } from "@/api/staffApi";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageTransition from "@/components/shared/PageTransition";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/context/AuthContext";

const addStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  role: z.enum(["ADMIN", "STAFF"]),
});

const editStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type AddStaffFormData = z.infer<typeof addStaffSchema>;
type EditStaffFormValues = z.infer<typeof editStaffSchema>;

const StaffManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [editGeneratedEmail, setEditGeneratedEmail] = useState("");

  const form = useForm<AddStaffFormData>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      name: '',
      role: 'STAFF',
      department: '',
    },
  });

  // Watch the name field to generate email
  const watchedName = form.watch("name");
  
  // Update generated email when name changes
  useEffect(() => {
    if (watchedName) {
      const email = `${watchedName.toLowerCase().replace(/\s+/g, '')}@connectingbee.in`;
      setGeneratedEmail(email);
    } else {
      setGeneratedEmail("");
    }
  }, [watchedName]);

  // Initialize edit form
  const editForm = useForm<EditStaffFormValues>({
    resolver: zodResolver(editStaffSchema),
  });

  // Watch name field in edit form for email generation
  const watchedEditName = editForm.watch("name");

  // Update generated email when name changes in edit form
  useEffect(() => {
    if (watchedEditName) {
      const email = `${watchedEditName.toLowerCase().replace(/\s+/g, '')}@connectingbee.in`;
      setEditGeneratedEmail(email);
    }
  }, [watchedEditName]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch staff members
  const fetchStaffMembers = async () => {
    setIsLoading(true);
    try {
      const response = await staffApi.getAllStaff();
      setStaffMembers(response);
    } catch (error) {
      console.error('Failed to fetch staff members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStaffMembers();
  }, []);

  // Reset edit form when selected staff changes
  useEffect(() => {
    if (selectedStaff) {
      editForm.reset({
        name: selectedStaff.name,
        department: selectedStaff.department || '',
        status: selectedStaff.status,
      });
      setEditGeneratedEmail(`${selectedStaff.name.toLowerCase().replace(/\s+/g, '')}@connectingbee.in`);
    }
  }, [selectedStaff, editForm]);

  const filteredStaff = staffMembers.filter(member => 
    (member?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member?.department?.toLowerCase().includes(searchQuery.toLowerCase())) ?? false
  );

  const handleAddStaff = async (data: AddStaffFormData) => {
    setIsSubmitting(true);
    try {
      const staffData: CreateStaffData = {
        name: data.name,
        email: generatedEmail,
        password: "password", // Set default password
        role: data.role as UserRole,
        department: data.department,
      };
      await staffApi.createStaff(staffData);
      await fetchStaffMembers(); // Refresh the list after adding
      setIsAddStaffDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: `Staff member ${data.name} has been added successfully. They will need to change their password on first login.`,
      });
    } catch (error: any) {
      console.error('Error adding staff:', error);
      if (error?.message?.includes('User already exists')) {
        toast({
          title: 'Email Already Registered',
          description: 'A staff member with this email address already exists.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add staff member. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: EditStaffFormValues) => {
    if (!selectedStaff) return;
    
    setIsSubmitting(true);
    try {
      await staffApi.updateStaff(selectedStaff.id, {
        ...data,
        email: editGeneratedEmail,
      });
      await fetchStaffMembers(); // Refresh the list after editing
      setIsEditStaffDialogOpen(false);
      setSelectedStaff(null);
      
      toast({
        title: "Staff updated",
        description: `${data.name}'s information has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const member = staffMembers.find(m => m.id === id);
    if (!member) return;

    try {
      await staffApi.deleteStaff(id);
      await fetchStaffMembers(); // Refresh the list after deleting
      
      toast({
        title: "Staff member removed",
        description: `${member.name} has been removed from the system.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (staffMember: StaffMember) => {
    try {
      await staffApi.toggleStatus(staffMember.id);
      await fetchStaffMembers(); // Refresh the list after toggling status
      
      toast({
        title: "Success",
        description: `Staff member status has been updated.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to update staff status:', error);
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive",
      });
    }
  };

  // Add data validation before rendering
  const validStaffMembers = staffMembers.filter(member => 
    member && member.name && member.email
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Staff Management</h2>
            <p className="text-muted-foreground">
              Manage your staff members and their roles
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Staff Member</DialogTitle>
                  <DialogDescription>
                    Add a new staff member to your team. They will receive an email invitation.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddStaff)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Display generated email */}
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          value={generatedEmail}
                          disabled
                          className="bg-muted"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Email is automatically generated from the staff member's name
                      </p>
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="Department" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="STAFF">Staff</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setIsAddStaffDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Staff Member
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage team permissions and access</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validStaffMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={member.status === "ACTIVE" ? "default" : "secondary"}
                          className={member.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.createdAt 
                          ? format(new Date(member.createdAt), 'MM/dd/yyyy')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedStaff(member);
                              setIsEditStaffDialogOpen(true);
                            }}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(member.id)}
                            title="Delete"
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

        {/* Edit Staff Dialog */}
        <Dialog open={isEditStaffDialogOpen} onOpenChange={setIsEditStaffDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>
                Update staff member information and status.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Display generated email */}
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      value={editGeneratedEmail}
                      disabled
                      className="bg-muted"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Email is automatically updated based on the staff member's name
                  </p>
                </FormItem>

                <FormField
                  control={editForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditStaffDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default StaffManagement;
