"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
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
import { Campaign } from "@/lib/types";
// import { campaigns } from "@/lib/placeholder-data";

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/campaigns/all`,
          {
            withCredentials: true, // 👈 Needed for cookie-based auth
            // headers: { Authorization: `Bearer ${token}` } // 👈 Uncomment for JWT
          }
        );
        const key_exists = localStorage.getItem("no_of_campaigns")
        if (key_exists == null) {
          localStorage.setItem("no_of_campaigns", res.data.length())
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

  // Filter campaigns based on search query and status filter
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.objective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all";

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your marketing campaigns and creator partnerships
          </p>
        </div>

        <Link href="/campaigns/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No campaigns found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
          <Link href="/campaigns/create">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create a Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              viewType="brand"
            />
          ))}
        </div>
      )}
    </div>
  );
}
