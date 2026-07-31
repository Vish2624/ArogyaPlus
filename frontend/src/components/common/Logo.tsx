import { useState } from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-12 w-auto" }: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-sm font-black text-white">
          AP
        </span>
        <span className="text-lg font-extrabold text-primary-800">ArogyaPlus</span>
      </span>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="ArogyaPlus"
      className={`${className} object-contain`}
      onError={() => setFailed(true)}
    />
  );
}
