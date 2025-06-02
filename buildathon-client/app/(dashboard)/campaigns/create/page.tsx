"use client";

import { useMemo, useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useDropzone } from "react-dropzone";

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

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [files, setFiles] = useState<File[]>([]);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      toast({
        title: "Files Uploaded",
        description: `${acceptedFiles.length} file(s) selected`,
      });
    },
  });

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // const onSubmit = async (values: CampaignFormValues) => {
  //   setSubmitting(true); // Indicate submission is in progress
  //   setError(""); // Clear any previous errors
  //   try {
  //     const formData = new FormData();

  //     formData.append("name", values.name);
  //     formData.append("title", values.title);
  //     formData.append("objective", values.objective);
  //     formData.append("hashtags", values.hashtags || "");

  //     formData.append("budget", JSON.stringify(values.budget));
  //     formData.append("platforms", JSON.stringify(values.platforms));
  //     formData.append(
  //       "languagePreferences",
  //       JSON.stringify(values.languagePreferences)
  //     );
  //     formData.append(
  //       "creatorCriteria",
  //       JSON.stringify(values.creatorCriteria)
  //     );

  //     // Append uploaded files to FormData
  //     files.forEach((file) => {
  //       formData.append("images", file); // Assuming your API expects 'images'
  //     });

  //     const resp = await axios.post(
  //       `${process.env.NEXT_PUBLIC_URL}/campaigns/create`,
  //       formData,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     console.log("logging api resp: ", resp);
  //     setSuccess("Campaign created successfully!"); // Display success message
  //     reset(); // Reset the form
  //   } catch (err: any) {
  //     // Use 'any' or a more specific type
  //     console.error("Error creating campaign:", err);
  //     setError(err.message || "An error occurred while creating the campaign."); // Display error message
  //   } finally {
  //     setSubmitting(false); // Indicate submission is complete
  //   }
  // };

  const onSubmit = async (values: CampaignFormValues) => {
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("title", values.title);
      formData.append("objective", values.objective);
      formData.append("hashtags", values.hashtags || "");

      formData.append("budget", JSON.stringify(values.budget));
      formData.append("platforms", JSON.stringify(values.platforms));
      formData.append(
        "languagePreferences",
        JSON.stringify(values.languagePreferences)
      );
      formData.append(
        "creatorCriteria",
        JSON.stringify(values.creatorCriteria)
      );

      // Append uploaded files to FormData
      files.forEach((file) => {
        formData.append("images", file); // Assuming your API expects 'images'
      });

      // --- First API Call: Create Campaign ---
      const campaignResp = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/campaigns/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true", // Add this header
          },
        }
      );

      console.log("Campaign creation API response: ", campaignResp.data);
      const campaignDetails = campaignResp.data;
      toast({
        title: "Campaign Created!",
        description: "Your campaign has been successfully launched.",
      });
      setSuccess("Campaign created successfully!");

      // --- Second API Call (After first one completes successfully) ---
      // Example: If the second API needs the ID of the newly created campaign
      const secondApiData = {
        title: campaignDetails.campaign.title,
      };

      console.log("Butterfly", secondApiData);

      try {
        const secondResp = await axios.post(
          "https://7d32-103-253-173-168.ngrok-free.app/api/v1/ai/influencer-match", // <--- REPLACE with your actual second API route
          secondApiData,
          {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "true", // Add this header
            },
          }
        );
        console.log("Secondary API response: ", secondResp.data);
        toast({
          title: "Secondary Action Complete",
          description: "Additional processes finished successfully.",
        });
      } catch (secondApiErr: any) {
        console.error("Error during secondary API call:", secondApiErr);
        // You might want to show a partial success message or a warning toast here
        toast({
          title: "Campaign Created (with warning)",
          description:
            "Campaign was created, but a secondary action failed. Please check console.",
          variant: "destructive",
        });
        // Do NOT set global error, as the primary action was successful
      }

      reset(); // Reset the form fields
      setFiles([]); // Clear selected files from dropzone
    } catch (err: any) {
      // This catch block handles errors from the *first* API call
      console.error("Error creating campaign:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during campaign creation."
      );
      toast({
        title: "Campaign Creation Failed",
        description: err.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const toggleInfluencer = (id: string) => {
    setSelectedInfluencers((prev) =>
      prev.includes(id) ? prev.filter((infId) => infId !== id) : [...prev, id]
    );
  };

  const finalizeCampaign = () => {
    form.handleSubmit(onSubmit)();
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
            {error && (
              <div className="mx-6 p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mx-6 p-4 bg-green-100 text-green-800 rounded-md">
                {success}
              </div>
            )}
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
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-md p-8 text-center ${
                        isDragActive ? "bg-primary/10" : ""
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-sm font-medium">
                          {isDragActive
                            ? "Drop your images here"
                            : "Drag & drop your images here"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Or click to browse (PNG, JPG up to 5MB)
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Choose Files
                        </Button>
                      </div>
                    </div>
                    {files.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Selected: {files.map((file) => file.name).join(", ")}
                      </div>
                    )}
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
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
                                  )
                                }
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
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
                                                (value) => value !== platform.id
                                              )
                                            );
                                      }}
                                      aria-label={`Select ${platform.label}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer font-normal">
                                    {platform.label}
                                  </FormLabel>
                                </FormItem>
                              )}
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
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Language Preferences</FormLabel>
                          <FormDescription>
                            Languages your campaign content should be in
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {languages.map((language) => (
                            <FormField
                              key={language.id}
                              control={form.control}
                              name="languagePreferences"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
                                                (value) => value !== language.id
                                              )
                                            );
                                      }}
                                      aria-label={`Select ${language.label}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer font-normal">
                                    {language.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
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
                            <Input
                              type="number"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
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
              <div className="flex gap-2">
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
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
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
