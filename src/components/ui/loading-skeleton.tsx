import { cn } from "@/lib/utils";

export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("rounded-lg border bg-card p-6 space-y-4", className)}>
    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
    <div className="space-y-2">
      <div className="h-3 bg-muted rounded animate-pulse" />
      <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
    </div>
  </div>
);

export const EventCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
    <div className="h-48 bg-muted animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-muted rounded animate-pulse w-4/5" />
      <div className="h-3 bg-muted rounded animate-pulse w-3/5" />
      <div className="h-3 bg-muted rounded animate-pulse w-full" />
      <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
    </div>
  </div>
);

export const VideoCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
    <div className="h-40 bg-muted animate-pulse" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse w-full" />
      <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
    </div>
  </div>
);

export const ProfileSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center space-x-4", className)}>
    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
      <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
    </div>
  </div>
);

export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4,
  className 
}: { 
  rows?: number; 
  columns?: number;
  className?: string;
}) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-10 bg-muted rounded animate-pulse flex-1"
          />
        ))}
      </div>
    ))}
  </div>
);

export const ListSkeleton = ({ 
  items = 5,
  className 
}: { 
  items?: number;
  className?: string;
}) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center gap-3">
        <div className="h-10 w-10 rounded bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
