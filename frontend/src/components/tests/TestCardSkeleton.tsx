import Skeleton from "@/components/common/Skeleton";

export default function TestCardSkeleton() {
  return (
    <div className="card flex flex-col p-6">
      <div className="mb-3 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
      <Skeleton className="mt-4 h-12 w-full rounded-xl" />
    </div>
  );
}
