import { Skeleton, SkeletonCard, SkeletonRow } from"@/components/Skeleton";

export default function Loading() {
 return (
 <div className="space-y-6 animate-in fade-in duration-500 p-6">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-2">
 <Skeleton className="h-8 w-64 rounded-xl"/>
 <Skeleton className="h-4 w-96 rounded-lg"/>
 </div>
 <Skeleton className="h-10 w-32 rounded-xl"/>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <SkeletonCard />
 <SkeletonCard />
 <SkeletonCard />
 <SkeletonCard />
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 space-y-6">
 <Skeleton className="h-[400px] w-full rounded-3xl"/>
 <Skeleton className="h-32 w-full rounded-2xl"/>
 </div>
 <div className="space-y-6">
 <Skeleton className="h-64 w-full rounded-2xl"/>
 <Skeleton className="h-64 w-full rounded-2xl"/>
 </div>
 </div>

 <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden">
 <div className="p-6 border-b border-openpos-border">
 <Skeleton className="h-6 w-48 rounded"/>
 </div>
 <div className="divide-y divide-openpos-border">
 <SkeletonRow />
 <SkeletonRow />
 <SkeletonRow />
 <SkeletonRow />
 </div>
 </div>
 </div>
 );
}
