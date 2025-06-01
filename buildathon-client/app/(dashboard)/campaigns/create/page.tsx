"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Hash,
  Upload,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

// Define campaign schema
const campaignSchema = z.object({
  name: z.string().min(3, { message: "Title must be at least 3 characters" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  objective: z
    .string()
    .min(10, { message: "Objective must be at least 10 characters" }),
  budget: z.object({
    total: z.coerce.number().min(1, { message: "Budget must be at least $1" }),
    perInfluencer: z.coerce.number().optional(),
  }),
  platforms: z
    .array(z.string())
    .min(1, { message: "Select at least one platform" }),
  hashtags: z.string().optional(),
  languagePreferences: z.array(z.string()),
  creatorCriteria: z.object({
    niche: z.string().min(1, { message: "Select a niche" }),
    minFollowers: z.coerce.number(),
    maxFollowers: z.coerce.number().optional(),
  }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const platforms = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "Twitter" },
];

const languages = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
];

const niches = [
  { id: "beauty", label: "Beauty" },
  { id: "fashion", label: "Fashion" },
  { id: "tech", label: "Technology" },
  { id: "gaming", label: "Gaming" },
  { id: "fitness", label: "Fitness" },
  { id: "food", label: "Food" },
  { id: "travel", label: "Travel" },
  { id: "lifestyle", label: "Lifestyle" },
];

const mockInfluencers = [
  {
    id: "inf1",
    name: "Alex Morgan",
    handle: "@alexmorgan",
    avatar: "https://i.pravatar.cc/150?img=1",
    niche: "Beauty & Lifestyle",
    followers: 125000,
    engagement: "4.8%",
  },
  {
    id: "inf2",
    name: "James Wilson",
    handle: "@jameswilson",
    avatar: "https://i.pravatar.cc/150?img=2",
    niche: "Tech Reviews",
    followers: 85000,
    engagement: "5.2%",
  },
  {
    id: "inf3",
    name: "Emma Chen",
    handle: "@emmachen",
    avatar: "https://i.pravatar.cc/150?img=3",
    niche: "Fashion",
    followers: 220000,
    engagement: "3.9%",
  },
  {
    id: "inf4",
    name: "Carlos Rodriguez",
    handle: "@carlosrodriguez",
    avatar: "https://i.pravatar.cc/150?img=4",
    niche: "Fitness",
    followers: 175000,
    engagement: "6.1%",
  },
  {
    id: "inf5",
    name: "Priya Sharma",
    handle: "@priyasharma",
    avatar: "https://i.pravatar.cc/150?img=5",
    niche: "Food & Travel",
    followers: 310000,
    engagement: "4.2%",
  },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalSteps = 3;
  const formData = [];

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      title: "",
      objective: "",
      budget: {
        total: 0,
        perInfluencer: undefined,
      },
      platforms: [],
      hashtags: "",
      languagePreferences: ["english"],
      creatorCriteria: {
        niche: "",
        minFollowers: 1000,
        maxFollowers: undefined,
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate current step
      switch (currentStep) {
        case 1:
          form.trigger(["title", "objective"]);
          if (form.formState.errors.title || form.formState.errors.objective) {
            return;
          }
          break;
        case 2:
          form.trigger(["budget.total", "platforms", "hashtags"]);
          if (
            form.formState.errors.budget?.total ||
            form.formState.errors.platforms
          ) {
            return;
          }
          break;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CampaignFormValues) => {
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/campaigns/create`, data);
      setSuccess("Campaign created successfully!");
      reset();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again.";
      setError(message);
    }
  };

  const filteredInfluencers = mockInfluencers.filter(
    (influencer) =>
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleInfluencer = (id: string) => {
    setSelectedInfluencers((prev) =>
      prev.includes(id) ? prev.filter((infId) => infId !== id) : [...prev, id]
    );
  };

  const finalizeCampaign = () => {
    toast({
      title: "Campaign created successfully!",
      description: `Campaign "${form.getValues(
        "title"
      )}" has been created with ${selectedInfluencers.length} influencers.`,
    });
    router.push("/campaigns");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Campaign
          </h1>
          <p className="text-muted-foreground">
            Set up your influencer marketing campaign
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/campaigns")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to campaigns
        </Button>
      </div>

      {/* Stepper */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                currentStep > i + 1
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep === i + 1
                  ? "border-primary text-primary"
                  : "border-muted-foreground text-muted-foreground"
              }`}
            >
              {currentStep > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`h-[2px] w-12 sm:w-24 md:w-32 ${
                  currentStep > i + 1 ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Campaign Details"}
                {currentStep === 2 && "Budget & Platforms"}
                {currentStep === 3 && "Creator Criteria"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 &&
                  "Provide basic information about your campaign"}
                {currentStep === 2 &&
                  "Set your budget and select target platforms"}
                {currentStep === 3 &&
                  "Define the type of creators you're looking for"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Campaign Details */}
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Vogue Vibe Collab"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear name for your campaign
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Summer Collection Launch"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear title for your campaign
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Objective</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you want to achieve with this campaign"
                            {...field}
                            className="min-h-[120px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about your goals and desired outcomes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormLabel>Campaign Images (Optional)</FormLabel>
                    <div className="border-2 border-dashed rounded-md p-8 text-center">
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-sm font-medium">
                          Drag & drop your images here
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Or click to browse (PNG, JPG up to 5MB)
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Choose Files
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Budget & Platforms */}
              {currentStep === 2 && (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="budget.total"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Budget</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                className="pl-7"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Your total campaign budget
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget.perInfluencer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Budget Per Influencer (Optional)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                className="pl-7"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Maximum amount per creator
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="platforms"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Platforms</FormLabel>
                          <FormDescription>
                            Select the social media platforms for your campaign
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {platforms.map((platform) => (
                            <FormField
                              key={platform.id}
                              control={form.control}
                              name="platforms"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={platform.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          platform.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                platform.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== platform.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                      {platform.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hashtags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Hashtags (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="summervibes, newcollection (comma separated)"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Hashtags to be used in campaign content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="languagePreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language Preferences</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {languages.map((language) => (
                            <FormField
                              key={language.id}
                              control={form.control}
                              name="languagePreferences"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={language.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          language.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                language.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== language.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                      {language.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormDescription>
                          Languages your campaign content should be in
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 3: Creator Criteria */}
              {currentStep === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="creatorCriteria.niche"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator Niche</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a niche" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {niches.map((niche) => (
                              <SelectItem key={niche.id} value={niche.id}>
                                {niche.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The primary content focus of creators
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="creatorCriteria.minFollowers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Followers</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum follower count required
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="creatorCriteria.maxFollowers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Followers (Optional)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum follower count (if any)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Campaign
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Recommendations Dialog */}
      <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Recommended Influencers</DialogTitle>
            <DialogDescription>
              AI-powered recommendations based on your campaign criteria
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search influencers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Top Picks</h4>
              <ScrollArea className="whitespace-nowrap py-2">
                <div className="flex space-x-4 pb-2">
                  {mockInfluencers.map((influencer) => (
                    <div
                      key={influencer.id}
                      className="w-[150px] text-center space-y-2"
                    >
                      <Avatar className="h-20 w-20 mx-auto border-2 border-muted p-1">
                        <AvatarImage
                          src={influencer.avatar}
                          alt={influencer.name}
                        />
                        <AvatarFallback>{influencer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium truncate">
                          {influencer.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {influencer.handle}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          selectedInfluencers.includes(influencer.id)
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => toggleInfluencer(influencer.id)}
                      >
                        {selectedInfluencers.includes(influencer.id)
                          ? "Selected"
                          : "Select"}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold mb-2">
                Personalized Search Results
              </h4>
              <div className="space-y-2">
                {filteredInfluencers.map((influencer) => (
                  <div
                    key={influencer.id}
                    className={`flex items-center gap-4 p-2 rounded-md ${
                      selectedInfluencers.includes(influencer.id)
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      id={`select-${influencer.id}`}
                      checked={selectedInfluencers.includes(influencer.id)}
                      onCheckedChange={() => toggleInfluencer(influencer.id)}
                    />
                    <Avatar>
                      <AvatarImage
                        src={influencer.avatar}
                        alt={influencer.name}
                      />
                      <AvatarFallback>{influencer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-medium">{influencer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {influencer.handle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {influencer.followers.toLocaleString()} followers
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Engagement: {influencer.engagement}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            <div className="text-sm">
              {selectedInfluencers.length} influencers selected
            </div>
            <Button onClick={finalizeCampaign}>Finalize Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Import this in client components only
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
