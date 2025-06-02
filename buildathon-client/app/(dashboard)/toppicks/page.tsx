'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Influencer } from '../../../lib/types'; // Still needed for the dialog

// Import the new reusable component
import { InfluencerCard } from '@/components/influencer-card'; // Adjust this path if necessary
import Link from 'next/link';
import axios from 'axios';

// Define your mock data (can be moved to a separate file if it gets large)
const mockInfluencers: Influencer[] = [
  {
    id: "inf1",
    name: "Alex Morgan",
    handle: "@alexmorgan",
    avatar: "https://i.pravatar.cc/150?img=1",
    niche: "Beauty & Lifestyle",
    followers: 125000,
    engagement: "4.8%",
    bio: "Passionate about clean beauty and healthy living. Sharing daily routines and lifestyle tips.",
    platformLinks: { instagram: "https://instagram.com/alexmorgan", youtube: "https://youtube.com/alexmorgan" }
  },
  {
    id: "inf2",
    name: "James Wilson",
    handle: "@jameswilson",
    avatar: "https://i.pravatar.cc/150?img=2",
    niche: "Tech Reviews",
    followers: 85000,
    engagement: "5.2%",
    bio: "Unboxing and reviewing the latest gadgets, from smartphones to gaming PCs.",
    platformLinks: { youtube: "https://youtube.com/jameswilson", twitter: "https://twitter.com/jameswilson" }
  },
  {
    id: "inf3",
    name: "Emma Chen",
    handle: "@emmachen",
    avatar: "https://i.pravatar.cc/150?img=3",
    niche: "Fashion",
    followers: 220000,
    engagement: "3.9%",
    bio: "Your go-to for affordable fashion finds and styling tips. Stay chic on a budget!",
    platformLinks: { instagram: "https://instagram.com/emmachen", twitter: "https://twitter.com/@emmachen" }
  },
  {
    id: "inf4",
    name: "Carlos Rodriguez",
    handle: "@carlosrodriguez",
    avatar: "https://i.pravatar.cc/150?img=4",
    niche: "Fitness",
    followers: 175000,
    engagement: "6.1%",
    bio: "Helping you achieve your fitness goals with effective workouts and nutrition advice.",
    platformLinks: { instagram: "https://instagram.com/carlosrodriguez", youtube: "https://youtube.com/carlosrodriguez" }
  },
  {
    id: "inf5",
    name: "Priya Sharma",
    handle: "@priyasharma",
    avatar: "https://i.pravatar.cc/150?img=5",
    niche: "Food & Travel",
    followers: 310000,
    engagement: "4.2%",
    bio: "Exploring the world one dish at a time! Sharing culinary adventures and travel guides.",
    platformLinks: { instagram: "https://instagram.com/priyasharma", twitter: "https://priyasharmablog.com" }
  },
  {
    id: "inf6",
    name: "John Doe",
    handle: "@johndoe",
    avatar: "https://i.pravatar.cc/150?img=6",
    niche: "Gaming",
    followers: 90000,
    engagement: "5.5%",
    bio: "Leveling up with daily streams and game reviews. Join the gaming community!",
    platformLinks: { youtube: "https://youtube.com/johndoe" }
  },
  {
    id: "inf7",
    name: "Alice Smith",
    handle: "@alicesmith",
    avatar: "https://i.pravatar.cc/150?img=7",
    niche: "Art & Design",
    followers: 150000,
    engagement: "4.0%",
    bio: "Bringing creative ideas to life through digital art and design tutorials.",
    platformLinks: { instagram: "https://instagram.com/alicesmith" }
  },
  {
    id: "inf8",
    name: "Robert Brown",
    handle: "@robertbrown",
    avatar: "https://i.pravatar.cc/150?img=8",
    niche: "Science",
    followers: 70000,
    engagement: "6.8%",
    bio: "Demystifying science one experiment at a time. Making complex topics fun and easy to understand.",
    platformLinks: { youtube: "https://youtube.com/robertbrown" }
  },
  {
    id: "inf9",
    name: "Sophia Lee",
    handle: "@sophialee",
    avatar: "https://i.pravatar.cc/150?img=9",
    niche: "Education",
    followers: 110000,
    engagement: "4.5%",
    bio: "Dedicated to lifelong learning and sharing educational resources for all ages.",
    platformLinks: { youtube: "https://youtube.com/sophialee" }
  },
];


export default function RecommendationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInfluencer, setDialogInfluencer] = useState<typeof mockInfluencers[0] | null>(null);

  const selectInfluencer = (id: string) => {
    setSelectedInfluencerId((prevId) => (prevId === id ? null : id));
  };

  const openInfluencerDialog = (influencer: typeof mockInfluencers[0]) => {
    setDialogInfluencer(influencer);
    setIsDialogOpen(true);
  };

  const filteredInfluencers = useMemo(() => {
    return mockInfluencers.filter((influencer) =>
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.niche.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const finalizeCampaign = () => {
    console.log('Selected Influencer ID:', selectedInfluencerId);
    if (selectedInfluencerId) {
      const selectedInfluencer = mockInfluencers.find(inf => inf.id === selectedInfluencerId);
      console.log('Selected Influencer Details:', selectedInfluencer);
      // Implement your campaign finalization logic here
    } else {
      console.log('No influencer selected.');
    }
  };

  const callHandler = async () => {
    
    try {
      const secondApiData = JSON.parse(localStorage.getItem("CallAPI") || "{}");

      // console.log("Butterfly", secondApiData);

      try {
        const secondResp = await axios.post(
          "https://7d32-103-253-173-168.ngrok-free.app/api/v1/ai/agent-call", // <--- REPLACE with your actual second API route
          secondApiData,
          {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "true", // Add this header
            },
          }
        );
        console.log("Secondary API response: ", secondResp.data);
      } catch (secondApiErr: any) {
        console.error("Error during secondary API call:", secondApiErr);
        // Do NOT set global error, as the primary action was successful
      }

      // reset(); // Reset the form fields
      // setFiles([]); // Clear selected files from dropzone
    } catch (err: any) {
      // This catch block handles errors from the *first* API call
      console.error("Error creating campaign:", err);
      // setError(
      //   err.response?.data?.message ||
      //     err.message ||
      //     "An error occurred during campaign creation."
      // );
      // toast({
      //   title: "Campaign Creation Failed",
      //   description: err.response?.data?.message || "Please try again.",
      //   variant: "destructive",
      // });
    } finally {
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recommended Influencers</h1>
        <p className="text-muted-foreground">
          AI-powered recommendations based on your campaign criteria
        </p>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-lg">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search influencers by name, handle, or niche..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Top Picks */}
        <div>
          <h4 className="font-semibold mb-2">Top Picks</h4>
          <div className="flex space-x-4 pb-2 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory">
            {mockInfluencers.map((influencer) => (
              <InfluencerCard
                key={influencer.id}
                influencer={influencer}
                selectedInfluencerId={selectedInfluencerId}
                onSelect={selectInfluencer}
                onAvatarClick={openInfluencerDialog}
                variant="compact" // Explicitly set variant for Top Picks
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Personalized Search Results */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar px-2">
          <h4 className="font-semibold mb-2 sticky top-0 bg-background z-10">
            Personalized Search Results
          </h4>
          {filteredInfluencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              selectedInfluencerId={selectedInfluencerId}
              onSelect={selectInfluencer}
              onAvatarClick={openInfluencerDialog}
              variant="detailed" // Explicitly set variant for Search Results
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t mt-6">
          <div className="text-sm">
            {selectedInfluencerId ? '1 influencer selected' : 'No influencer selected'}
          </div>
          <Button onClick={finalizeCampaign} disabled={!selectedInfluencerId}>
            Finalize Campaign
          </Button>
        </div>
      </div>

      {/* --- Influencer Detail Dialog --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {dialogInfluencer && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <Avatar className="h-24 w-24 mx-auto mb-4 border-2 p-1">
                <AvatarImage src={dialogInfluencer.avatar} alt={dialogInfluencer.name} />
                <AvatarFallback>{dialogInfluencer.name[0]}</AvatarFallback>
              </Avatar>
              <DialogTitle className="text-center text-2xl">
                {dialogInfluencer.name}
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground">
                {dialogInfluencer.handle}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Niche:</span>
                <span>{dialogInfluencer.niche}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Followers:</span>
                <span>{dialogInfluencer.followers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Engagement:</span>
                <span>{dialogInfluencer.engagement}</span>
              </div>
              <Separator />
              <div>
                <p className="font-medium mb-2">Bio:</p>
                <p className="text-sm text-muted-foreground">{dialogInfluencer.bio || 'No bio available.'}</p>
              </div>
              <Button onClick={() => callHandler()}>Initiate Call</Button>
              {/* {dialogInfluencer.platformLinks && (
                <div>
                  <p className="font-medium mb-2">Platforms:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(dialogInfluencer.platformLinks).map(([platform, link]) => (
                      <Link key={platform} href={link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}