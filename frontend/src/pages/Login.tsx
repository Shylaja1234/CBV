import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, LogIn, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoginCredentials } from "@/api/authApi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Update form schema to remove role
const loginSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email("Invalid email address"),
  password: z.string({
    required_error: "Password is required",
  }).min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Initialize form without role
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };
      
      const redirectPath = await login(credentials);
      
      // If this is a first-time login, redirect to change password
      if (redirectPath === '/auth/first-time-password') {
        navigate(redirectPath, { 
          state: { 
            isFirstLogin: true,
            email: data.email 
          }, 
          replace: true 
        });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      // Handle specific error messages from the API
      if (err?.message) {
        setError(err.message);
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to sign in. Please check your credentials and try again.");
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="container px-4 py-12">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex justify-center mb-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                  <CardDescription className="text-center">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="example@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {error && (
                        <div className="text-sm text-destructive">{error}</div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>Signing in...</>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline">
                      Create an account
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Login;
