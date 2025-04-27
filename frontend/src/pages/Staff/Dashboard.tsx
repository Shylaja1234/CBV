import { useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tag, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const StaffDashboard = () => {
  const { user } = useAuth();

  return (
    <PageTransition>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Staff Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}! You have limited access to manage products and pricing.</p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Manage Products</CardTitle>
                <CardDescription>Add, edit, or remove products</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-24 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-primary/40" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/staff/products">Go to Products</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Manage Pricing</CardTitle>
                <CardDescription>Update pricing plans</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-24 flex items-center justify-center">
                  <Tag className="h-12 w-12 text-primary/40" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/staff/pricing">Go to Pricing</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">View Site</CardTitle>
                <CardDescription>See how the site looks to customers</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-24 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-primary/40" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Visit Site</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Activity</CardTitle>
              <CardDescription>Your recent actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity to display.</p>
                  <p className="text-sm">Actions you take will appear here.</p>
                </div>
              </div>
            </CardContent>
          </Card>
    </PageTransition>
  );
};

export default StaffDashboard;
