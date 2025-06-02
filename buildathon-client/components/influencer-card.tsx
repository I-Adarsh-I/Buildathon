import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// import type { Influencer } from '@/types/Influencer'; // Adjust path to where your Influencer type is defined
// TODO: Update the path below to the correct location of your Influencer type definition
import type { Influencer } from '../lib/types'

// Define the props interface for the InfluencerCard component
interface InfluencerCardProps {
  influencer: Influencer; // Type of a single influencer object
  selectedInfluencerId: string | null;
  onSelect: (id: string) => void;
  onAvatarClick: (influencer: Influencer) => void;
  variant?: 'compact' | 'detailed'; // Optional variant for different layouts
}

export function InfluencerCard({
  influencer,
  selectedInfluencerId,
  onSelect,
  onAvatarClick,
  variant = 'compact', // Default variant
}: InfluencerCardProps) {
  const isSelected = selectedInfluencerId === influencer.id;

  if (variant === 'detailed') {
    // Layout for the personalized search results (more detailed row)
    return (
      <div
        key={influencer.id}
        className={`flex items-center gap-4 p-2 rounded-md ${
          isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
        }`}
      >
        <Avatar
          className="cursor-pointer"
          onClick={() => onAvatarClick(influencer)}
        >
          <AvatarImage src={influencer.avatar} alt={influencer.name} />
          <AvatarFallback>{influencer.name[0]}</AvatarFallback>
        </Avatar>
        <div
          className="flex-1 grid grid-cols-2 gap-2 cursor-pointer"
          onClick={() => onSelect(influencer.id)}
        >
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
        {isSelected && (
          <span className="text-primary text-sm font-semibold">✓</span>
        )}
      </div>
    );
  }

  // Default 'compact' layout for Top Picks
  return (
    <div
      key={influencer.id}
      className="w-[150px] text-center space-y-2 flex-shrink-0 snap-start"
    >
      <Avatar
        className="h-20 w-20 mx-auto border-2 border-muted p-1 cursor-pointer"
        onClick={() => onAvatarClick(influencer)}
      >
        <AvatarImage src={influencer.avatar} alt={influencer.name} />
        <AvatarFallback>{influencer.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium truncate">{influencer.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {influencer.handle}
        </p>
      </div>
      <Button
        size="sm"
        variant={isSelected ? 'default' : 'outline'}
        className="w-full"
        onClick={() => onSelect(influencer.id)}
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </div>
  );
}