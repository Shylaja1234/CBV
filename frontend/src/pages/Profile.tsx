import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, User, Mail, Key, X, Check, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userApi } from "@/api/userApi";
import { Separator } from "@/components/ui/separator";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from 'axios';

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUserInfo, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [tab, setTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  // Address state
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressForm, setAddressForm] = useState<any | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressEditId, setAddressEditId] = useState<number | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // Order state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setError(null);
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (!user) {
        throw new Error("You must be logged in to update your profile");
      }

      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error("Name and email are required");
      }

      setIsLoading(true);
      setError(null);

      console.log('Starting profile update with data:', formData);

      const response = await userApi.updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      console.log('Profile update response:', response);

      // Update the user context with the new data
      updateUserInfo({
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Profile Update Error:', error);
      
      let errorMessage = "Failed to update profile";
      if (error instanceof AxiosError) {
        console.error('Axios Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });

        // Handle 401 Unauthorized error
        if (error.response?.status === 401) {
          errorMessage = "Your session has expired. Please log in again.";
          toast({
            title: "Authentication Error",
            description: errorMessage,
            variant: "destructive",
            duration: 5000,
          });
          
          // Set a timeout to allow the toast to be shown before redirecting
          setTimeout(() => {
            handleLogout();
          }, 2000);
          
          return;
        }
        
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch addresses
  useEffect(() => {
    if (tab === 'addresses') {
      setAddressLoading(true);
      userApi.getAddresses().then(setAddresses).finally(() => setAddressLoading(false));
    }
  }, [tab]);

  // Fetch orders
  useEffect(() => {
    if (tab === 'orders') {
      setOrdersLoading(true);
      userApi.getOrders().then(setOrders).finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  // Address form handlers
  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleAddAddress = () => {
    setAddressForm({ name: '', phone: '', pincode: '', address1: '', address2: '', city: '', state: '', country: 'India' });
    setAddressEditId(null);
    setShowAddressForm(true);
  };
  const handleEditAddress = (address: any) => {
    setAddressForm(address);
    setAddressEditId(address.id);
    setShowAddressForm(true);
  };
  const handleDeleteAddress = async (id: number) => {
    if (window.confirm('Delete this address?')) {
      await userApi.deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };
  const handleAddressFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addressEditId) {
      const updated = await userApi.updateAddress(addressEditId, addressForm);
      setAddresses(addresses.map(a => a.id === addressEditId ? updated : a));
    } else {
      const created = await userApi.addAddress(addressForm);
      setAddresses([...addresses, created]);
    }
    setShowAddressForm(false);
  };

  // If not authenticated, show loading state instead of immediate redirect
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageTransition>
        <main className="flex-grow pt-24 pb-16 px-4 md:px-8">
          <div className="max-w-2xl mx-auto space-y-6 mt-8">
            <div className="flex gap-2 mb-4">
              <Button variant={tab === 'profile' ? 'default' : 'outline'} onClick={() => setTab('profile')}>Profile</Button>
              <Button variant={tab === 'orders' ? 'default' : 'outline'} onClick={() => setTab('orders')}>Order History</Button>
              <Button variant={tab === 'addresses' ? 'default' : 'outline'} onClick={() => setTab('addresses')}>Manage Addresses</Button>
            </div>
            {tab === 'profile' && (
              <>
                <Card className="bg-card shadow-lg">
                  <CardHeader className="space-y-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <CardTitle className="text-2xl font-bold">Profile</CardTitle>
                        <CardDescription>
                          View and manage your profile information
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <div className="mb-4 p-4 border border-red-500 bg-red-50 dark:bg-red-900/10 rounded-md">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                <Card className="bg-card shadow-lg mt-6">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl font-bold">Password Settings</CardTitle>
                    <CardDescription>
                      Change your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link to="/change-password" className="flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
            {tab === 'orders' && (
              <Card className="bg-card shadow-lg">
                <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
                <CardContent>
                  {ordersLoading ? <Loader2 className="animate-spin" /> : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th>ID</th><th>Date</th><th>Total (₹)</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.createdAt).toLocaleString('en-IN')}</td>
                            <td>₹{(order.total / 100).toLocaleString('en-IN')}</td>
                            <td>{order.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            )}
            {tab === 'addresses' && (
              <Card className="bg-card shadow-lg">
                <CardHeader>
                  <CardTitle>Manage Addresses</CardTitle>
                  <Button onClick={handleAddAddress} className="mt-2">Add Address</Button>
                </CardHeader>
                <CardContent>
                  {addressLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                      {addresses.length === 0 && <div>No addresses found.</div>}
                      <ul className="space-y-4">
                        {addresses.map((address) => (
                          <li key={address.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <div><b>{address.name}</b> ({address.phone})</div>
                              <div>{address.address1}, {address.address2 && address.address2 + ', '}{address.city}, {address.state} - {address.pincode}, {address.country}</div>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                              <Button size="sm" variant="outline" onClick={() => handleEditAddress(address)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteAddress(address.id)}>Delete</Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {showAddressForm && (
                        <form onSubmit={handleAddressFormSubmit} className="mt-6 space-y-2 border-t pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Input name="name" placeholder="Name" value={addressForm.name} onChange={handleAddressFormChange} required />
                            <Input name="phone" placeholder="Phone" value={addressForm.phone} onChange={handleAddressFormChange} required />
                            <Input name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressFormChange} required />
                            <Input name="address1" placeholder="Address Line 1" value={addressForm.address1} onChange={handleAddressFormChange} required />
                            <Input name="address2" placeholder="Address Line 2" value={addressForm.address2} onChange={handleAddressFormChange} />
                            <Input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressFormChange} required />
                            <Input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressFormChange} required />
                            <Input name="country" placeholder="Country" value={addressForm.country} onChange={handleAddressFormChange} required />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button type="submit">{addressEditId ? 'Update' : 'Add'} Address</Button>
                            <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Profile; 