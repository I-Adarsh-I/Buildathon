"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { campaigns } from "@/lib/placeholder-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Campaign } from "@/lib/types";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/campaigns/all`,
          {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "true", // Add this header
            }, // 👈 Needed for cookie-based auth
            // headers: { Authorization: `Bearer ${token}` } // 👈 Uncomment for JWT
          }
        );
        const campaigns = res.data;
        const keyExists = localStorage.getItem("no_of_campaigns");
        if (keyExists === null) {
          localStorage.setItem("no_of_campaigns", campaigns.length);
        }
        setCampaigns(res.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <p className="p-4">Loading campaigns...</p>;

  // Filter active campaigns based on search query and platform filter
  // const activeCampaigns = campaigns.filter(
  //   (campaign) => campaign.status === "active"
  // );
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign?.objective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === "all" ||
      campaign.platforms.includes(platformFilter as any);

    return matchesSearch && matchesPlatform;
  });

  // Platform options for filter
  const platformOptions = [
    { value: "all", label: "All Platforms" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "Twitter" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Discover Campaigns
        </h1>
        <p className="text-muted-foreground">
          Find brand partnerships that match your content style and audience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Campaign Match</CardTitle>
          <CardDescription>
            Our AI-powered system recommends campaigns based on your profile and
            content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by keywords, brand, product..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recommended for You</h2>

        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-lg font-medium">No matching campaigns found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filter criteria
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setPlatformFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                viewType="creator"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
