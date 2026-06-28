"use client";

import Image from "next/image";
import TrustBadges from "../components/TrustBadges";
import ParallaxHero from "../components/animations/ParallaxHero";
import FadeUp from "../components/animations/FadeUp";
import TextReveal from "../components/animations/TextReveal";

const galleryImages = [
  { src: "/women-maroon-african-dress.jpg", alt: "Women maroon African dress" },
  { src: "/men-maroon-stripe.jpg", alt: "Men maroon stripe outfit" },
  { src: "/women-ankara-teal-gown.jpg", alt: "Women ankara teal gown" },
  { src: "/hero-woman-jumpsuit.jpg", alt: "Woman jumpsuit" },
  { src: "/women-brown-ankara-set.jpg", alt: "Women brown ankara set" },
  { src: "/men-pink-agbada.jpg", alt: "Men pink agbada" },
];

export default function ContactPage() {
  return (
    <>
      {/* ── PARALLAX HERO ── */}
      <ParallaxHero
        imageSrc="/clothing-rack.jpg"
        overlayClass="bg-ground/80"
        height="min-h-[60vh] sm:min-h-[55vh]"
      >
        <div className="flex flex-col items-center justify-center text-center px-4">
          <TextReveal
            text="CONTACT US"
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-pure-white font-display"
          />
          <FadeUp delay={0.4}>
            <p className="text-ivory/85 mt-4 text-sm tracking-wide font-sans">
              Home / Contact
            </p>
          </FadeUp>
        </div>
      </ParallaxHero>

      {/* ── TRUST BADGES ── */}
      <FadeUp>
        <TrustBadges variant="dark" />
      </FadeUp>

      {/* ── CONTACT FORM SECTION ── */}
      <section className="bg-ivory py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <p className="text-sm text-antique-gold uppercase tracking-[0.2em] font-sans font-semibold">
              Need Assistance?
            </p>
          </FadeUp>

          <TextReveal
            text="Get In Touch"
            as="h2"
            className="text-3xl md:text-4xl font-semibold text-ground mt-2 font-display"
          />

          <FadeUp delay={0.3}>
            <form action="#" method="POST" className="mt-12">
              {/* Row 1 -- Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Your Name"
                  className="w-full border-b-2 border-ground/25 py-4 px-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 text-ground placeholder:text-ground/50 bg-transparent font-sans"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full border-b-2 border-ground/25 py-4 px-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 text-ground placeholder:text-ground/50 bg-transparent font-sans"
                />
              </div>

              {/* Row 2 -- Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full border-b-2 border-ground/25 py-4 px-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 text-ground placeholder:text-ground/50 bg-transparent font-sans"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full border-b-2 border-ground/25 py-4 px-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 text-ground placeholder:text-ground/50 bg-transparent font-sans"
                />
              </div>

              {/* Row 3 -- Location */}
              <div className="mb-6">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="w-full border-b-2 border-ground/25 py-4 px-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 text-ground placeholder:text-ground/50 bg-transparent font-sans"
                />
              </div>

              {/* Row 4 -- Message */}
              <div className="mb-10">
                <textarea
                  name="message"
                  placeholder="Message Here"
                  className="w-full border-b-2 border-ground/25 py-4 px-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 text-ground placeholder:text-ground/50 bg-transparent min-h-[140px] resize-y font-sans"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-ground text-ivory px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-signal-red transition-all duration-300 hover:shadow-lg hover:shadow-signal-red/25 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                Submit
              </button>
            </form>
          </FadeUp>
        </div>
      </section>

      {/* ── IMAGE GALLERY STRIP ── */}
      <section className="bg-ivory px-6 pb-16">
        <FadeUp>
          <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-3">
            {galleryImages.map((img) => (
              <div
                key={img.src}
                className="aspect-square relative rounded-lg overflow-hidden group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── MAP SECTION ── */}
      <section className="bg-ivory px-6 pb-20">
        <FadeUp>
          <div className="max-w-5xl mx-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.62283124594!2d3.28395955!3d6.548055099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="G-Stitches Location"
              className="rounded-2xl"
            />
          </div>
        </FadeUp>
      </section>
    </>
  );
}
