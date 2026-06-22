"use client";

import { useState } from "react";
import Image from "next/image";
import TrustBadges from "../components/TrustBadges";
import ParallaxHero from "../components/animations/ParallaxHero";
import FadeUp from "../components/animations/FadeUp";
import TextReveal from "../components/animations/TextReveal";

const timeSlots = [
  { label: "9:00 AM" },
  { label: "10:00 AM" },
  { label: "11:00 AM" },
  { label: "12:00 PM" },
  { label: "2:00 PM" },
  { label: "3:00 PM" },
];

const expectations = [
  "45-minute initial Consultation",
  "Full measurement session",
  "Fabric and style guidance",
  "No obligation to commit",
];

const steps = [
  {
    num: "01",
    title: "Book Online",
    desc: "Fill in your details and choose your preferred date and time slot.",
  },
  {
    num: "02",
    title: "Fitting",
    desc: "Visit our atelier for a personalised fitting and style consultation.",
  },
  {
    num: "03",
    title: "Collection",
    desc: "Pick up your perfectly finished piece, tailored to perfection.",
  },
];

const inputClass =
  "border-b-2 border-ground/10 py-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 w-full bg-transparent text-ground font-sans";

export default function BookFittingPage() {
  const [activeSlot, setActiveSlot] = useState("11:00 AM");

  return (
    <>
      {/* ── PARALLAX HERO ── */}
      <ParallaxHero
        imageSrc="/designer-sketching.jpg"
        overlayClass="bg-ground/70"
        height="min-h-[55vh]"
      >
        <div className="flex flex-col items-center justify-center text-center px-6">
          <FadeUp>
            <p className="text-antique-gold tracking-[0.3em] text-xs uppercase font-sans">
              BOOK YOUR SESSION
            </p>
          </FadeUp>

          <TextReveal
            text="Book a Fitting"
            className="text-3xl sm:text-5xl md:text-7xl text-pure-white font-display mt-4"
          />

          <FadeUp delay={0.5}>
            <p className="text-ivory/70 mt-4 max-w-md mx-auto text-center text-sm md:text-base leading-relaxed font-sans">
              Experience the art of bespoke African fashion with a personalised
              fitting session at our atelier.
            </p>
          </FadeUp>
        </div>
      </ParallaxHero>

      {/* ── TRUST BADGES ── */}
      <FadeUp>
        <TrustBadges variant="dark" />
      </FadeUp>

      {/* ── THREE-STEP PROCESS ── */}
      <section className="bg-ivory py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.15}>
              <div
                className={`text-center md:text-left px-6 ${
                  i > 0 ? "md:border-l-2 md:border-ground/10 md:pl-8" : ""
                }`}
              >
                <p className="text-5xl font-bold text-ground/10 font-sans">
                  {step.num}
                </p>
                <p className="text-xl font-semibold text-ground mt-2 font-sans">
                  {step.title}
                </p>
                <p className="text-sm text-ground/50 mt-2 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── BOOKING FORM + SIDEBAR ── */}
      <section className="bg-ivory px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          {/* LEFT — FORM */}
          <FadeUp>
            <div>
              <p className="text-xs font-semibold text-antique-gold tracking-[0.2em] font-sans">
                YOUR DETAILS
              </p>
              <TextReveal
                text="Tell Us About Yourself"
                as="h2"
                className="text-2xl md:text-3xl font-semibold text-ground mt-2 font-display"
              />

              <form className="mt-8 space-y-1" onSubmit={(e) => e.preventDefault()}>
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-ground/50 uppercase tracking-wider font-sans">
                      First
                    </label>
                    <input type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ground/50 uppercase tracking-wider font-sans">
                      Last
                    </label>
                    <input type="text" className={inputClass} />
                  </div>
                </div>

                {/* Contact row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-ground/50 uppercase tracking-wider font-sans">
                      Email
                    </label>
                    <input type="email" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ground/50 uppercase tracking-wider font-sans">
                      Phone
                    </label>
                    <input type="tel" className={inputClass} />
                  </div>
                </div>

                {/* Select row */}
                <div>
                  <label className="text-xs font-semibold text-ground/50 uppercase tracking-wider font-sans">
                    Select A
                  </label>
                  <select className={inputClass}>
                    <option value="">-- Choose an option --</option>
                    <option value="bridal">Bridal Wear</option>
                    <option value="casual">Casual Wear</option>
                    <option value="formal">Formal Wear</option>
                    <option value="traditional">Traditional Wear</option>
                  </select>
                </div>

                {/* ── SCHEDULE ── */}
                <div>
                  <p className="text-xs font-semibold text-antique-gold tracking-[0.2em] mt-10 font-sans">
                    SCHEDULE
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="text-xs font-semibold text-ground/50 uppercase tracking-wider font-sans">
                        Preferred Date
                      </label>
                      <input
                        type="text"
                        placeholder="DD / MM / YYYY"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ground/50 uppercase tracking-wider font-sans">
                        Preferred Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Time slot buttons */}
                  <p className="text-xs font-semibold text-ground/50 uppercase tracking-wider mt-6 font-sans">
                    Available
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {timeSlots.map((slot) => {
                      const isActive = slot.label === activeSlot;
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => setActiveSlot(slot.label)}
                          className={`px-4 py-3 min-h-[44px] rounded-full text-xs font-medium cursor-pointer transition-all duration-300 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold ${
                            isActive
                              ? "bg-signal-red text-pure-white border-signal-red shadow-lg shadow-signal-red/25 border-2"
                              : "border-2 border-ground/10 text-ground/50 hover:border-ground hover:text-ground"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional notes */}
                <div className="pt-4">
                  <label className="text-xs font-semibold text-ground/50 uppercase tracking-wider font-sans">
                    Additional Notes
                  </label>
                  <textarea
                    className="border-b-2 border-ground/10 py-4 w-full min-h-[100px] text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 bg-transparent resize-y mt-1 text-ground font-sans"
                    placeholder="Any special requests or details..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="bg-ground text-ivory py-4 rounded-full text-sm font-semibold tracking-[0.15em] uppercase hover:bg-signal-red transition-all duration-300 hover:shadow-lg w-full mt-6 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                >
                  CONFIRM APPOINTMENT
                </button>
              </form>
            </div>
          </FadeUp>

          {/* RIGHT — SIDEBAR */}
          <FadeUp delay={0.3}>
            <div>
              {/* Sidebar image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image
                  src="/women-maroon-african-dress.jpg"
                  alt="Woman in elegant African dress"
                  fill
                  className="object-cover"
                />
              </div>

              {/* What to expect */}
              <h3 className="text-sm font-semibold text-ground mt-8 tracking-wider font-sans">
                WHAT TO EXPECT
              </h3>
              <ul className="mt-4 space-y-3">
                {expectations.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-ground/60 font-sans"
                  >
                    <span className="w-5 h-5 bg-signal-red/10 text-signal-red rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Map placeholder */}
              <div className="bg-ground/5 rounded-2xl h-[160px] w-full mt-6 flex items-center justify-center">
                <span className="text-sm text-ground/30 font-sans">Map Location</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
