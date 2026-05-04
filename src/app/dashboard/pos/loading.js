import { Skeleton } from"@/components/Skeleton";

export default function Loading() {
 return (
 <div className="h-screen flex bg-[#F1F5F9] p-3 gap-3 overflow-hidden">
 {/* Left Column */}
 <div className="flex-1 flex flex-col gap-3">
 <div className="flex justify-between items-center h-10">
 <Skeleton className="h-8 w-8 rounded-lg"/>
 <Skeleton className="h-8 w-48 rounded-xl"/>
 <Skeleton className="h-8 w-8 rounded-lg"/>
 </div>
 <Skeleton className="h-12 w-full rounded-xl"/>
 <div className="flex gap-2">
 <Skeleton className="h-8 w-16 rounded-lg"/>
 <Skeleton className="h-8 w-24 rounded-lg"/>
 <Skeleton className="h-8 w-24 rounded-lg"/>
 <Skeleton className="h-8 w-24 rounded-lg"/>
 </div>
 <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
 {Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="bg-card-bg border border-openpos-border rounded-2xl p-3 space-y-3">
 <Skeleton className="aspect-[4/3] w-full rounded-xl"/>
 <Skeleton className="h-4 w-3/4 rounded"/>
 <div className="flex justify-between">
 <Skeleton className="h-4 w-12 rounded"/>
 <Skeleton className="h-4 w-16 rounded"/>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Right Column */}
 <div className="w-[360px] bg-card-bg border-l border-openpos-border flex flex-col p-6 space-y-6">
 <div className="flex items-center gap-3">
 <Skeleton className="h-10 w-10 rounded-xl"/>
 <div className="space-y-1">
 <Skeleton className="h-3 w-20 rounded"/>
 <Skeleton className="h-4 w-24 rounded"/>
 </div>
 </div>
 <div className="flex-1 space-y-4">
 <Skeleton className="h-20 w-full rounded-2xl"/>
 <Skeleton className="h-20 w-full rounded-2xl"/>
 <Skeleton className="h-20 w-full rounded-2xl"/>
 </div>
 <div className="space-y-4">
 <div className="flex justify-between">
 <Skeleton className="h-4 w-12 rounded"/>
 <Skeleton className="h-6 w-24 rounded"/>
 </div>
 <Skeleton className="h-14 w-full rounded-xl"/>
 </div>
 </div>
 </div>
 );
}
