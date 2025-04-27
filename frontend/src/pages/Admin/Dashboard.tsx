import { useState, useEffect } from "react";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, LineChart, Line } from "recharts";
import { ArrowUpRight, Users, IndianRupee, ShoppingBag, TrendingUp } from "lucide-react";

// Format currency in Indian format
const formatIndianCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// Demo data
const stats = {
  totalSales: 1955000,
  totalProfit: 1050000,
  totalVisitors: 26606,
  totalOrders: 256,
};

const salesData = [
  { month: 'Jan', sales: 350000, visitors: 15000 },
  { month: 'Feb', sales: 290000, visitors: 12000 },
  { month: 'Mar', sales: 180000, visitors: 18000 },
  { month: 'Apr', sales: 270000, visitors: 22000 },
  { month: 'May', sales: 180000, visitors: 15000 },
  { month: 'Jun', sales: 195000, visitors: 19000 },
  { month: 'Jul', sales: 320000, visitors: 25000 },
];

const profitData = [
  { month: 'Jan', profit: 250000, loss: 0 },
  { month: 'Feb', profit: 180000, loss: 0 },
  { month: 'Mar', profit: 120000, loss: 50000 },
  { month: 'Apr', profit: 190000, loss: 0 },
  { month: 'May', profit: 80000, loss: 0 },
  { month: 'Jun', profit: 150000, loss: 0 },
  { month: 'Jul', profit: 200000, loss: 0 },
];

const Dashboard = () => {
  return (
    <PageTransition>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Sales</p>
                  <h3 className="text-2xl font-bold">{formatIndianCurrency(stats.totalSales)}</h3>
                  <p className="text-sm text-emerald-500 flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    12% from last month
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Profit</p>
                  <h3 className="text-2xl font-bold">{formatIndianCurrency(stats.totalProfit)}</h3>
                  <p className="text-sm text-emerald-500 flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    8% from last month
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Visitors</p>
                  <h3 className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</h3>
                  <p className="text-sm text-emerald-500 flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    18% from last month
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Orders</p>
                  <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                  <p className="text-sm text-emerald-500 flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    5% from last month
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Visitors</CardTitle>
              <CardDescription>Monthly sales and visitor analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="visitors" name="Visitors" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss</CardTitle>
              <CardDescription>Monthly profit and loss analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="loss" name="Loss" stroke="#ff0000" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest orders and user activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Order #{Math.floor(Math.random() * 10000)}</p>
                      <p className="text-sm text-muted-foreground">
                        Customer purchased Product {Math.floor(Math.random() * 10) + 1}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 60) + 1} minutes ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
