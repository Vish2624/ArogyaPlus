import StarRating from "@/components/common/StarRating";

const TITLE = "What Our Patients Say";

const TESTIMONIALS = [
  {
    name: "Fatima Al Suwaidi",
    location: "Dubai Marina, Dubai",
    rating: 5,
    feedback:
      "The home visit was seamless - the technician arrived on time and my report was ready the next day. Highly recommend ArogyaPlus.",
  },
  {
    name: "Rahul Menon",
    location: "Business Bay, Dubai",
    rating: 5,
    feedback: "Booking a full health package took less than five minutes online. Clear pricing and no surprises at all.",
  },
  {
    name: "Sara Al Hammadi",
    location: "Jumeirah, Dubai",
    rating: 4,
    feedback: "Great experience mixing individual tests with a package in one booking. The staff were professional and courteous.",
  },
];

export default function Testimonials() {
  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <div className="text-center">
          <p className="eyebrow text-primary-600">Testimonials</p>
          <h2 className="mt-2 text-page-title font-bold text-slate-900">{TITLE}</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="card bg-white p-6 hover:-translate-y-0.5 hover:shadow-hover hover:ring-primary-500/40 sm:p-8"
            >
              <StarRating rating={testimonial.rating} />
              <p className="mt-4 text-base leading-7 text-slate-600">&ldquo;{testimonial.feedback}&rdquo;</p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-xs text-slate-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
