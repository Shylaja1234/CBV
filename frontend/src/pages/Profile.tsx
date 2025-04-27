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
            {/* Profile Card */}
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

            {/* Password Change Card */}
            <Card className="bg-card shadow-lg">
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
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Profile; 