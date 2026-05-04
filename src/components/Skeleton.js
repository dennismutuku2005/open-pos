import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-openpos-bg-subtle shimmer-wrapper", className)}
      {...props}
    />
  );
}

export function SkeletonCircle({ size = 40, className }) {
  return (
    <Skeleton 
      className={cn("rounded-full", className)} 
      style={{ width: size, height: size }} 
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card-bg border border-openpos-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <div className="flex items-center gap-4 py-4 px-5">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={cn(
          "h-4 rounded",
          i === 0 ? "w-16" : i === cols - 1 ? "w-12 ml-auto" : "flex-1"
        )} />
      ))}
    </div>
  );
}
