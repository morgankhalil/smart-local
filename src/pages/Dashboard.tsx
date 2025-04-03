
import React from "react";
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Summary Cards */}
              {['Users', 'Revenue', 'Activity'].map((title) => (
                <Card key={title}>
                  <CardHeader className="pb-2">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>Summary for current period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {title === 'Users' && '1,234'}
                      {title === 'Revenue' && '$5,678'}
                      {title === 'Activity' && '892'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">Activity Item {item}</p>
                          <p className="text-sm text-muted-foreground">Brief description of the activity</p>
                        </div>
                        <span className="text-sm text-muted-foreground">2h ago</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Your data visualization and reports</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center bg-muted/20">
                <p>Charts and analytics will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Settings options will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
