import EmojiIcon from "@/utils/emojiIcons";

const TITLE = "Our Certified Labs";

const CERTIFICATIONS = [
  { icon: "🏅", title: "CAP Accredited", subtitle: "College of American Pathologists certified partner labs" },
  { icon: "🔬", title: "ISO 15189 Certified", subtitle: "Internationally recognized medical laboratory quality standard" },
  { icon: "🇦🇪", title: "DHA Approved", subtitle: "Licensed by Dubai Health Authority" },
  { icon: "✅", title: "NABL Accredited", subtitle: "National accreditation for testing and calibration labs" },
];

export default function CertifiedLabs() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="text-center">
          <p className="eyebrow text-primary-600">Accreditation</p>
          <h2 className="mt-2 text-page-title font-bold text-slate-900">{TITLE}</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATIONS.map((cert, index) => (
            <div
              key={`${cert.title}-${index}`}
              className="card p-8 text-center hover:-translate-y-0.5 hover:shadow-hover hover:ring-primary-500/40"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-700 ring-4 ring-primary-50">
                <EmojiIcon emoji={cert.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{cert.title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-500">{cert.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
