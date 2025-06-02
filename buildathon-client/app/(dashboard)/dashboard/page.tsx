"use client";

import { getUserRole } from "@/lib/auth";
import { BarChart2, CircleDollarSign, UserCheck, Calendar } from "lucide-react";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "../../../components/Loader";

interface User {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  profilePhoto?: string;
  bio?: string;
  interests?: string[];
  languagePreference?: string[];
  aiTags?: string[];
}

// Sample data for the activity feed
const recentActivities = [
  {
    id: "1",
    type: "application" as const,
    title: "New application",
    description: 'applied to your "Summer Collection Launch" campaign.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    user: {
      name: "Emma Johnson",
      image:
        "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    status: "pending" as const,
  },
  {
    id: "2",
    type: "message" as const,
    title: "New message",
    description: "sent you a message regarding the tech review campaign.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    user: {
      name: "Alex Rodriguez",
      image:
        "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
  },
  {
    id: "3",
    type: "payment" as const,
    title: "Payment completed",
    description: 'for the "Summer Collection Launch" campaign.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    user: {
      name: "Emma Johnson",
      image:
        "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    status: "completed" as const,
  },
  {
    id: "4",
    type: "contract" as const,
    title: "Contract signed",
    description: 'for the "New Smartphone Review" campaign.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    user: {
      name: "Alex Rodriguez",
      image:
        "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    status: "completed" as const,
  },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(null);
  const [noOfCampaigns, setNoOfCampaigns] = useState(0);
  const userRole = getUserRole();
  const isBrand = userRole === "user";
  let no_of_campaigns;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/user/me`,
          {
            withCredentials: true, // Required for cookie-based auth
          }
        );
        const { email, profilePhoto, name, role } = response.data.user;
        const filteredUser = { email, profilePhoto, name, role };
        localStorage.setItem("userInfo", JSON.stringify(filteredUser));
        setUser(response.data.user);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch user data");
        setLoading(false);
      }
    };

    // Fetch campaigns (as per your existing code)
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/campaigns/all`,
          {
            withCredentials: true,
          }
        );
        const campaigns = res.data;
        setNoOfCampaigns(campaigns.length);
        localStorage.setItem("no_of_campaigns", campaigns.length);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCurrentUser();
    fetchCampaigns();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    objective: "",
    images: [""],
    budget: {
      total: "",
      perInfluencer: "",
    },
    platforms: [""],
    hashtags: [""],
    languagePreferences: [""],
    creatorCriteria: {
      niche: "",
      minFollowers: "",
      maxFollowers: "",
    },
  });

  no_of_campaigns = localStorage.getItem("no_of_campaigns");
  // userInfo = localStorage.getItem("userInfo");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (loading) {
    return <Loader text="Loading..." className="h-screen" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}.
          </p>
        </div>

        {isBrand ? (
          <Link href="/campaigns/create">
            <Button>Create New Campaign</Button>
          </Link>
        ) : (
          <Link href="/discover">
            <Button>Find Campaigns</Button>
          </Link>
        )}
      </div>

      <div
        className={`grid gap-4 md:grid-cols-2 lg:${
          isBrand ? "grid-cols-3" : "grid-cols-4"
        }`}
      >
        {isBrand ? (
          <>
            <OverviewCard
              title="Total Campaigns"
              value={`${no_of_campaigns}`}
              description="2 active, 1 draft"
              icon={<BarChart2 className="h-4 w-4" />}
              variant="blue"
            />
            <OverviewCard
              title="Active Creators"
              value="2"
              description="4 pending applications"
              icon={<UserCheck className="h-4 w-4" />}
              variant="green"
            />
            <OverviewCard
              title="Total Spent"
              value="$5,000"
              description="This month"
              trend="up"
              trendValue="12%"
              icon={<CircleDollarSign className="h-4 w-4" />}
              variant="purple"
            />
            {/* <OverviewCard
              title="Upcoming Campaigns"
              value="1"
              description="Starts July 1"
              icon={<Calendar className="h-4 w-4" />}
              variant="orange"
            /> */}
          </>
        ) : (
          <>
            <OverviewCard
              title="Active Collaborations"
              value="1"
              description="1 completed"
              icon={<BarChart2 className="h-4 w-4" />}
              variant="blue"
            />
            <OverviewCard
              title="Available Campaigns"
              value="8"
              description="Matching your profile"
              icon={<UserCheck className="h-4 w-4" />}
              variant="green"
            />
            <OverviewCard
              title="Total Earnings"
              value="$2,500"
              description="This month"
              trend="up"
              trendValue="20%"
              icon={<CircleDollarSign className="h-4 w-4" />}
              variant="purple"
            />
            <OverviewCard
              title="Pending Deliverables"
              value="3"
              description="Due next week"
              icon={<Calendar className="h-4 w-4" />}
              variant="orange"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4">
          <ActivityFeed activities={recentActivities} />
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Get personalized help and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="text-sm font-medium mb-2">Suggested actions</h4>
                <ul className="space-y-3 text-sm">
                  {isBrand ? (
                    <>
                      <li className="flex items-center">
                        <span className="mr-2">🔍</span>
                        <span>Review new creator applications</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">📊</span>
                        <span>Check Summer campaign performance</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">💬</span>
                        <span>Respond to creator messages (2)</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center">
                        <span className="mr-2">🔍</span>
                        <span>Complete your profile to get more matches</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">📊</span>
                        <span>Submit remaining deliverables</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">💬</span>
                        <span>Respond to brand messages (1)</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium mb-2">Ask AI Assistant</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask something..."
                    className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button
                    className="absolute right-1 top-1 h-6 w-6 p-0"
                    size="icon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
