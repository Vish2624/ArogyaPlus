import Skeleton from "@/components/common/Skeleton";

export default function PackageCardSkeleton() {
  return (
    <div className="card flex flex-col p-6">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </div>
    </div>
  );
}
