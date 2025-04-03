
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentActivityProps {
  limit?: number;
}

// This is a placeholder component that would be connected to real activity data
const RecentActivity = ({ limit = 10 }: RecentActivityProps) => {
  // Sample activity data - in a real implementation, this would come from the database
  const activities = [
    {
      id: 1,
      type: "purchase",
      title: "Purchased Garden Tools",
      credits: 15,
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 2,
      type: "sale",
      title: "Sold Painting Workshop",
      credits: 25,
      date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
    {
      id: 3,
      type: "listing",
      title: "Created new listing for Yoga Class",
      credits: null,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: 4,
      type: "favorite",
      title: "Added Gardening Service to favorites",
      credits: null,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
    {
      id: 5,
      type: "sale",
      title: "Sold Home-made Bread Tutorial",
      credits: 10,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
  ].slice(0, limit);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffMinutes < 60 * 24) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMinutes / (60 * 24));
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'purchase': return 'destructive';
      case 'sale': return 'default';
      case 'listing': return 'secondary';
      case 'favorite': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest interactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getBadgeVariant(activity.type)}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Badge>
                    {activity.credits !== null && (
                      <span className={`text-sm font-medium ${activity.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.type === 'sale' ? '+' : '-'}{activity.credits} credits
                      </span>
                    )}
                  </div>
                  <p className="font-medium">{activity.title}</p>
                </div>
                <span className="text-sm text-muted-foreground">{formatDate(activity.date)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
