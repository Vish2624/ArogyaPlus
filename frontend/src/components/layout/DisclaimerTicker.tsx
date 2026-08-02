import { ShieldCheck } from "lucide-react";

const DISCLAIMER_TEXT =
  "ArogyaPlus is a technology platform powered by Walletedge. All at-home and in-clinic healthcare services are independently provided by CAP-accredited labs and DHA-licensed professionals, with all data securely stored locally within the UAE.";

export default function DisclaimerTicker() {
  return (
    <div className="overflow-hidden border-b border-white/10 bg-primary-950 py-1.5" role="note">
      <div className="animate-marquee motion-reduce:animate-none flex w-max items-center gap-16 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center gap-2 text-[11px] font-medium text-white/70" aria-hidden={copy === 1}>
            <ShieldCheck className="h-3 w-3 shrink-0 text-primary-400" aria-hidden="true" />
            {DISCLAIMER_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
