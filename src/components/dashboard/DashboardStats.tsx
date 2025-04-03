
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CreditCard, ListChecks, User } from "lucide-react";

const DashboardStats = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">4</div>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="ml-1">from last month</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Credits Earned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">120</div>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">8%</span>
            <span className="ml-1">from last month</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Credits Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">86</div>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">4%</span>
            <span className="ml-1">from last month</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Engaged Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">12</div>
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">16%</span>
            <span className="ml-1">from last month</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
