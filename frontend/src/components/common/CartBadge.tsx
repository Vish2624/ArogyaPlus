import { useEffect, useRef, useState } from "react";

interface CartBadgeProps {
  count: number;
  className: string;
}

export default function CartBadge({ count, className }: CartBadgeProps) {
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
    }
    prevCount.current = count;
  }, [count]);

  if (count <= 0) return null;

  return (
    <span onAnimationEnd={() => setBump(false)} className={`${className} ${bump ? "badge-bump" : ""}`}>
      {count}
    </span>
  );
}
