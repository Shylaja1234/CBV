import { useState, useEffect } from "react";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, LineChart, Line } from "recharts";
import { ArrowUpRight, Users, IndianRupee, ShoppingBag, TrendingUp, Mail } from "lucide-react";
import api from '@/lib/axios';

// Format currency in Indian format
const formatIndianCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalVisitors: 0,
    totalOrders: 0,
    contactCount: 0,
    prevSales: 0,
    prevProfit: 0,
    prevVisitors: 0,
    prevOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [ordersRes, usersRes, messagesRes, salesRes, profitRes, activityRes] = await Promise.all([
          api.get('/api/orders/admin/summary'), // { totalSales, totalProfit, totalOrders, prevSales, prevProfit, prevOrders }
          api.get('/api/users/admin/summary'),  // { totalVisitors, prevVisitors }
          api.get('/api/messages'),             // Array of messages
          api.get('/api/orders/admin/sales-chart'), // [{ month, sales, visitors }]
          api.get('/api/orders/admin/profit-chart'), // [{ month, profit, loss }]
          api.get('/api/orders/admin/recent-activity'), // [{ id, orderId, productName, createdAt }]
        ]);
        setStats({
          totalSales: ordersRes.data.totalSales,
          totalProfit: ordersRes.data.totalProfit,
          totalOrders: ordersRes.data.totalOrders,
          contactCount: Array.isArray(messagesRes.data) ? messagesRes.data.length : 0,
          prevSales: ordersRes.data.prevSales,
          prevProfit: ordersRes.data.prevProfit,
          prevOrders: ordersRes.data.prevOrders,
          totalVisitors: usersRes.data.totalVisitors,
          prevVisitors: usersRes.data.prevVisitors,
        });
        setSalesData(Array.isArray(salesRes.data) ? salesRes.data : []);
        setProfitData(Array.isArray(profitRes.data) ? profitRes.data : []);
        setActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
      } catch (err) {
        setStats({ totalSales: 0, totalProfit: 0, totalVisitors: 0, totalOrders: 0, contactCount: 0, prevSales: 0, prevProfit: 0, prevVisitors: 0, prevOrders: 0 });
        setSalesData([]);
        setProfitData([]);
        setActivity([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Helper to calculate percent change
  const percentChange = (current: number, prev: number) => {
    if (prev === 0 || prev === undefined || prev === null) return 'N/A';
    const change = ((current - prev) / prev) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <PageTransition>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Sales</p>
                  <h3 className="text-2xl font-bold">{formatIndianCurrency(stats.totalSales)}</h3>
                  <p className="text-sm text-emerald-500 flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {percentChange(stats.totalSales, stats.prevSales)} from last month
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
                    {percentChange(stats.totalProfit, stats.prevProfit)} from last month
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
                    {percentChange(stats.totalVisitors, stats.prevVisitors)} from last month
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
                    {percentChange(stats.totalOrders, stats.prevOrders)} from last month
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Contact Messages</p>
                  <h3 className="text-2xl font-bold">{stats.contactCount}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
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
              <div className="h-[300px] flex items-center justify-center">
                {salesData.length === 0 ? (
                  <div className="text-muted-foreground">No sales or visitor data available.</div>
                ) : (
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
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss</CardTitle>
              <CardDescription>Monthly profit and loss analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                {profitData.length === 0 ? (
                  <div className="text-muted-foreground">No profit/loss data available.</div>
                ) : (
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
                )}
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
              {activity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No recent activity to display.</div>
              ) : (
                activity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Order #{item.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          Customer purchased {item.productName}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : ''}
                    </div>
                  </div>
                ))
              )}
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
