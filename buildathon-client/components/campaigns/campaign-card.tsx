import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CampaignStatus, Campaign } from "@/lib/types";

interface CampaignCardProps {
  campaign: Campaign;
  viewType?: "brand" | "creator";
  className?: string;
}

// Helper function to format budget as currency
const formatBudget = (budget: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(budget);
};

// Helper function to format date ranges
// const formatDateRange = (startDate: string, endDate: string) => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

//   return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
// };

// Helper function to get status badge variant
const getStatusVariant = (status: CampaignStatus) => {
  switch (status) {
    case "active":
      return "default";
    case "draft":
      return "outline";
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export function CampaignCard({
  campaign,
  viewType = "brand",
  className,
}: CampaignCardProps) {
  const { _id, title, objective, budget, platforms } = campaign;

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {title}
          </CardTitle>
          <Badge variant={getStatusVariant("active")}>
            {/* {status.charAt(0).toUpperCase() + status.slice(1)} */}
            Active
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{objective}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Budget</p>
            <p className="font-medium">{formatBudget(budget.total)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Per Influencer Cost</p>
            <p className="font-medium">{budget.perInfluencer}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Platforms</p>
          <div className="flex flex-wrap gap-1">
            {platforms.map((platform) => (
              <Badge key={platform} variant="secondary" className="capitalize">
                {platform}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        {viewType === "brand" ? (
          <Link href="campaigns/create" className="w-full">
            <Button variant="outline" className="w-full">
              Manage Campaign
            </Button>
          </Link>
        ) : (
          <div className="flex w-full gap-2">
            <Link href={`/discover/${_id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            <Link href={`/discover/${_id}/apply`} className="flex-1">
              <Button className="w-full">Apply Now</Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
