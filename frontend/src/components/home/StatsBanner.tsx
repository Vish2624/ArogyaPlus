const STATS = [
  { value: "50,000+", label: "Families Served" },
  { value: "+12", label: "Years of Trust" },
  { value: "250+", label: "Tests Available" },
  { value: "98%", label: "Happy Patients" },
];

export default function StatsBanner() {
  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 divide-y divide-slate-100 rounded-card border border-slate-200 bg-white p-5 shadow-clinical sm:grid-cols-4 sm:gap-8 sm:divide-x sm:divide-y-0 sm:p-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-2 text-center">
              <div className="text-xl font-black text-primary-700 sm:text-2xl">{stat.value}</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
