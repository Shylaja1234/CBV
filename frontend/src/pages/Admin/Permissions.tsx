
import { useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Permission {
  id: string;
  name: string;
  description: string;
  defaultRoles: Array<"admin" | "staff" | "user">;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  canEdit: boolean;
}

// Mock permission data
const mockPermissions: Permission[] = [
  { id: "view_dashboard", name: "View Dashboard", description: "View admin dashboard statistics", defaultRoles: ["admin", "staff"] },
  { id: "manage_content", name: "Manage Content", description: "Create, edit, and delete content pages", defaultRoles: ["admin"] },
  { id: "publish_content", name: "Publish Content", description: "Publish content to live site", defaultRoles: ["admin"] },
  { id: "manage_products", name: "Manage Products", description: "Create, edit, and delete products", defaultRoles: ["admin", "staff"] },
  { id: "manage_orders", name: "Manage Orders", description: "View and process customer orders", defaultRoles: ["admin", "staff"] },
  { id: "manage_users", name: "Manage Users", description: "Create, edit, and delete user accounts", defaultRoles: ["admin"] },
  { id: "manage_staff", name: "Manage Staff", description: "Add, edit, and remove staff members", defaultRoles: ["admin"] },
  { id: "view_reports", name: "View Reports", description: "Access analytics and reports", defaultRoles: ["admin", "staff"] },
  { id: "manage_settings", name: "Manage Settings", description: "Configure site-wide settings", defaultRoles: ["admin"] },
];

// Mock role data
const mockRoles: Role[] = [
  { 
    id: "admin", 
    name: "Administrator", 
    description: "Full access to all features", 
    permissions: mockPermissions.map(p => p.id),
    canEdit: false
  },
  { 
    id: "staff", 
    name: "Staff", 
    description: "Limited access to manage content and products", 
    permissions: mockPermissions.filter(p => p.defaultRoles.includes("staff")).map(p => p.id),
    canEdit: true
  },
  { 
    id: "user", 
    name: "User", 
    description: "Standard customer account", 
    permissions: [],
    canEdit: true
  },
  { 
    id: "editor", 
    name: "Editor", 
    description: "Can manage and publish content", 
    permissions: ["view_dashboard", "manage_content", "publish_content", "view_reports"],
    canEdit: true
  },
  { 
    id: "analyst", 
    name: "Analyst", 
    description: "View-only access to reports and analytics", 
    permissions: ["view_dashboard", "view_reports"],
    canEdit: true
  },
];

const Permissions = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<string>("staff");

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const newPermissions = role.permissions.includes(permissionId)
          ? role.permissions.filter(id => id !== permissionId)
          : [...role.permissions, permissionId];
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
    
    toast({
      title: "Permission updated",
      description: `Permission settings have been updated for ${roleId} role.`,
    });
  };

  const selectedRoleData = roles.find(role => role.id === selectedRole) || roles[0];

  return (
    <PageTransition>
      <AdminLayout>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Permissions & Access</h1>
            <p className="text-muted-foreground">Manage roles and permissions across your site</p>
          </div>

          <Tabs defaultValue="roles">
            <TabsList className="mb-6">
              <TabsTrigger value="roles">Role Permissions</TabsTrigger>
              <TabsTrigger value="permissions">Permissions List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                    <CardDescription>Customize access permissions for each role</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <label className="text-sm font-medium mb-2 block">Select Role:</label>
                      <Select 
                        value={selectedRole} 
                        onValueChange={setSelectedRole}
                      >
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedRoleData && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">{selectedRoleData.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Permission</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions.map((permission) => (
                          <TableRow key={permission.id}>
                            <TableCell className="font-medium">{permission.name}</TableCell>
                            <TableCell>{permission.description}</TableCell>
                            <TableCell>
                              <Switch 
                                checked={selectedRoleData.permissions.includes(permission.id)}
                                onCheckedChange={() => {
                                  if (selectedRoleData.canEdit) {
                                    handlePermissionToggle(selectedRoleData.id, permission.id);
                                  } else {
                                    toast({
                                      title: "Cannot modify",
                                      description: "The Administrator role permissions cannot be modified.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                disabled={!selectedRoleData.canEdit}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {!selectedRoleData.canEdit && (
                      <div className="mt-4 flex items-start p-4 border rounded-md bg-muted/30">
                        <Info className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          The Administrator role has full access to all features by default and cannot be modified for security reasons.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>System Permissions</CardTitle>
                  <CardDescription>Complete list of system permissions and their default access</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Default Access</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">{permission.name}</TableCell>
                          <TableCell>{permission.description}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {permission.defaultRoles.map((role) => (
                                <span 
                                  key={role} 
                                  className="px-2 py-1 text-xs rounded-full bg-muted"
                                >
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </PageTransition>
  );
};

export default Permissions;
