import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ActivityType = 'application' | 'message' | 'payment' | 'contract';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    image?: string;
  };
  status?: 'pending' | 'completed' | 'rejected';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  // Function to format the timestamp to a relative time (e.g., "2 hours ago")
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return activityTime.toLocaleDateString();
  };

  // Function to get icon based on activity type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'application':
        return "📝";
      case 'message':
        return "💬";
      case 'payment':
        return "💰";
      case 'contract':
        return "📄";
      default:
        return "🔔";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Stay updated with the latest activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No recent activity to display
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activity.user.image} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {activity.user.name}
                    </p>
                    <div className="flex items-center">
                      {activity.status && (
                        <Badge 
                          variant={
                            activity.status === 'completed' ? 'default' : 
                            activity.status === 'rejected' ? 'destructive' : 
                            'outline'
                          }
                          className="mr-2"
                        >
                          {activity.status}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="mr-2">{getActivityIcon(activity.type)}</span>
                    <span className="font-medium">{activity.title}</span>
                    <span className="ml-1">{activity.description}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}