import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  "transition-all hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        purple: "bg-gradient-to-br from-purple-500 to-purple-900 text-white border-purple-800",
        blue: "bg-gradient-to-br from-blue-500 to-blue-900 text-white border-blue-800",
        green: "bg-gradient-to-br from-green-500 to-green-900 text-white border-green-800",
        orange: "bg-gradient-to-br from-orange-500 to-orange-900 text-white border-orange-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface OverviewCardProps extends VariantProps<typeof cardVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function OverviewCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  variant,
  className,
}: OverviewCardProps) {
  return (
    <Card className={cn(cardVariants({ variant }), className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn("text-base font-medium", 
          variant && variant !== 'default' ? "text-white" : "text-foreground"
        )}>
          {title}
        </CardTitle>
        {icon && <div className={cn(
          "h-8 w-8 flex items-center justify-center rounded-full",
          variant && variant !== 'default' ? "bg-white/20" : "bg-muted"
        )}>
          {icon}
        </div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {value}
        </div>
        {(description || trend) && (
          <div className="flex items-center text-xs">
            {trend && (
              <span className={cn("mr-2 flex items-center", 
                trend === 'up' ? "text-green-500" : 
                trend === 'down' ? "text-red-500" : "text-yellow-500"
              )}>
                {trend === 'up' && (
                  <svg xmlns="http://www.w3.org/2000/svg\" className="h-3 w-3 mr-1\" viewBox="0 0 20 20\" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z\" clipRule="evenodd" />
                  </svg>
                )}
                {trend === 'down' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                )}
                {trend === 'neutral' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {trendValue}
              </span>
            )}
            <span className={cn("text-xs", 
              variant && variant !== 'default' ? "text-white/80" : "text-muted-foreground"
            )}>
              {description}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}