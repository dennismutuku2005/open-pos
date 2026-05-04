import { Skeleton, SkeletonCard, SkeletonRow } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-openpos-border flex justify-between bg-openpos-bg-subtle/10">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-10 w-72 rounded-xl" />
        </div>
        <div className="divide-y divide-openpos-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-24 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
