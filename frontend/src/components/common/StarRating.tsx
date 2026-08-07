import { Star } from "lucide-react";

export default function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rating ? "h-4 w-4 fill-gold-400 text-gold-400" : "h-4 w-4 text-slate-200"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
