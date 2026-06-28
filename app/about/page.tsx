"use client";

import Image from "next/image";
import Link from "next/link";
import TrustBadges from "../components/TrustBadges";
import ParallaxHero from "../components/animations/ParallaxHero";
import FadeUp from "../components/animations/FadeUp";
import TextReveal from "../components/animations/TextReveal";
import NumberCounter from "../components/animations/NumberCounter";
import StickySection from "../components/animations/StickySection";

const testimonials = [
  {
    name: "Amina Johnson",
    review:
      "G-Stitches transformed my wardrobe! The quality is outstanding and the fit is always perfect. I get compliments every time I wear their pieces.",
  },
  {
    name: "Chidera Okonkwo",
    review:
      "I love how every piece feels like it was made just for me. The attention to detail and craftsmanship is unmatched. Highly recommend!",
  },
  {
    name: "Fatima Bello",
    review:
      "From casual wear to elegant gowns, G-Stitches never disappoints. Their customer service is exceptional and delivery is always on time.",
  },
];

const stickyPanels = [
  {
    id: "our-story",
    content: (
      <div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-ground mb-4">
          Our Story
        </h3>
        <p className="text-ground/80 leading-relaxed font-sans">
          What began as a humble passion for African fashion has blossomed into a
          celebrated brand trusted by thousands. G-Stitches was born from a deep
          love for the vibrant textures, bold patterns, and rich heritage of
          African design. From our earliest days, we set out to honour tradition
          while embracing contemporary style, creating garments that tell a story
          with every stitch.
        </p>
      </div>
    ),
  },
  {
    id: "our-craft",
    content: (
      <div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-ground mb-4">
          Our Craft
        </h3>
        <p className="text-ground/80 leading-relaxed font-sans">
          Every piece that leaves our studio is a testament to meticulous
          attention to detail. We source only premium fabrics from trusted
          suppliers, ensuring each garment feels as luxurious as it looks. Our
          skilled tailors bring decades of combined experience to every cut and
          seam, blending time-honoured techniques with modern precision to
          deliver fashion that stands apart.
        </p>
      </div>
    ),
  },
  {
    id: "our-promise",
    content: (
      <div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-ground mb-4">
          Our Promise
        </h3>
        <p className="text-ground/80 leading-relaxed font-sans">
          Customer satisfaction is not just our goal; it is our standard. We
          promise a perfect fit every time, backed by personalised consultations
          and expert alterations. From the moment you reach out to the day you
          slip into your custom piece, we are dedicated to making every step of
          your experience effortless, memorable, and truly special.
        </p>
      </div>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ===== 1. PARALLAX HERO ===== */}
      <ParallaxHero
        imageSrc="/designer-sketching.jpg"
        imageAlt="Designer sketching fashion illustrations"
        overlayClass="bg-ground/75"
        height="min-h-[65vh] sm:min-h-[70vh]"
      >
        <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <FadeUp>
            <p className="font-sans uppercase tracking-[0.3em] text-antique-gold text-sm">
              Our Story
            </p>
          </FadeUp>

          <TextReveal
            text="ABOUT US"
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black text-pure-white mt-4"
          />

          <FadeUp delay={0.5}>
            <p className="text-ivory/90 max-w-lg mx-auto mt-6 text-center font-sans">
              Trendy pieces. Timeless styles. G-Stitches has everything you need
              to rock and feel your best. Discover the passion and
              craftsmanship behind every garment we create.
            </p>
          </FadeUp>

          <FadeUp delay={0.7}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/"
                className="bg-pure-white text-ground rounded-full px-8 py-3 text-sm font-sans font-medium uppercase tracking-[0.1em] hover:bg-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ground focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Shop Now
              </Link>
              <Link
                href="/"
                className="border border-ivory text-ivory rounded-full px-8 py-3 text-sm font-sans font-medium uppercase tracking-[0.1em] hover:bg-ivory/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Explore Collection
              </Link>
            </div>
          </FadeUp>
        </div>
      </ParallaxHero>

      {/* ===== 2. TRUST BADGES ===== */}
      <FadeUp>
        <TrustBadges variant="light" />
      </FadeUp>

      {/* ===== 3. STICKY STORYTELLING SECTION ===== */}
      <section className="py-16 md:py-24 bg-ivory">
        <StickySection
          stickyPosition="left"
          stickyContent={
            <div className="relative rounded-sm overflow-hidden aspect-[4/5]">
              <Image
                src="/tailor-sewing-machine.jpg"
                alt="Master tailor working at a sewing machine"
                fill
                className="object-cover"
              />
            </div>
          }
          panels={stickyPanels}
        />
      </section>

      {/* ===== 4. NUMBER COUNTERS ===== */}
      <section className="bg-ground py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 [&_span]:text-ivory [&_p]:text-ivory/85">
            <NumberCounter target={500} suffix="+" label="Happy Clients" />
            <NumberCounter target={1200} suffix="+" label="Outfits Crafted" />
            <NumberCounter target={15} suffix="+" label="Years Experience" />
            <NumberCounter target={50} suffix="+" label="Award Winning" />
          </div>
        </div>
      </section>


      {/* ===== 5. IMAGE + TEXT SECTION ===== */}
      <section className="bg-ivory px-6 py-16 md:py-24">
        <FadeUp>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-sm overflow-hidden aspect-[3/4]">
              <Image
                src="/women-maroon-beaded-gown.jpg"
                alt="Elegant maroon beaded gown by G-Stitches"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-sans uppercase tracking-[0.3em] text-antique-gold text-xs mb-3">
                Craftsmanship
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ground mb-6">
                Our Craft
              </h2>
              <p className="text-ground/80 leading-relaxed mb-4 font-sans">
                Each garment begins as a vision, carefully sketched and refined
                before a single thread is cut. Our master tailors bring decades
                of expertise to every piece, combining traditional African
                techniques with contemporary silhouettes that flatter and
                empower.
              </p>
              <p className="text-ground/80 leading-relaxed mb-4 font-sans">
                We source only the finest fabrics from across the continent,
                selecting materials for their texture, durability, and beauty.
                From hand-sewn beading to intricate embroidery, every detail is
                executed with precision and care.
              </p>
              <p className="text-ground/80 leading-relaxed font-sans">
                The result is fashion that doesn&apos;t just look beautiful but
                tells a story. A story of heritage, artistry, and the relentless
                pursuit of perfection that defines G-Stitches.
              </p>
            </div>
          </div>
        </FadeUp>
      </section>


      {/* ===== 6. TESTIMONIALS ===== */}
      <section className="bg-ground py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="font-sans text-xs text-antique-gold uppercase tracking-[0.3em] mb-2">
              Testimonials
            </p>
          </FadeUp>

          <TextReveal
            text="Clients Review"
            as="h2"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-ivory mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.15}>
                <div className="bg-ivory/5 rounded-sm p-6 border border-antique-gold/10 text-left h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-signal-red/80 to-ground shrink-0 flex items-center justify-center text-pure-white font-display font-bold text-lg ring-2 ring-antique-gold/20">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-ivory text-sm">
                        {t.name}
                      </p>
                      <p className="text-antique-gold text-sm tracking-wide">
                        {"★★★★★"}
                      </p>
                    </div>
                  </div>
                  <p className="text-ivory/85 text-sm leading-relaxed font-sans">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
