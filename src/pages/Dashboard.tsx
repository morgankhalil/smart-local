
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { ListingWithDetails } from "@/types/listings";
import ListingCard from "@/components/listings/ListingCard";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock, CreditCard, ListChecks, Plus, Repeat, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import DashboardStats from "@/components/dashboard/DashboardStats";
import UserListings from "@/components/dashboard/UserListings";
import RecentActivity from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view your dashboard",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  if (!user || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to view your dashboard</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/auth">Go to Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">My Dashboard</h1>
          <div className="space-x-2">
            <Button asChild>
              <Link to="/create-listing">
                <Plus className="mr-2 h-4 w-4" /> Create New Listing
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Credit Balance Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Your Credit Balance</p>
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-bold">{profile.credits || 0}</h2>
                  <span className="text-lg ml-2 text-muted-foreground">credits</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline" className="mr-2">
                  <Repeat className="mr-2 h-4 w-4" /> Transactions
                </Button>
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" /> Credit History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <DashboardStats />
            <UserListings limit={3} showViewAll={true} />
            <RecentActivity limit={5} />
          </TabsContent>
          
          <TabsContent value="my-listings">
            <UserListings />
          </TabsContent>
          
          <TabsContent value="activity">
            <RecentActivity />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Account Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Email: {user.email} 
                      {profile.is_verified ? 
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">Verified</Badge> : 
                        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700">Unverified</Badge>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Display Name: {profile.display_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
