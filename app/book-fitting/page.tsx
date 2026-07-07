"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
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
  "border-b-2 border-ground/25 py-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 w-full bg-transparent text-ground font-sans";

const MAX_IMAGE_MB = 5;

export default function BookFittingPage() {
  const [activeSlot, setActiveSlot] = useState("11:00 AM");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`Image must be smaller than ${MAX_IMAGE_MB}MB.`);
      return;
    }

    setReferenceImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setReferenceImage(null);
    setPreviewUrl(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const { data: { user } } = await supabase.auth.getUser();

    // Upload the reference image first, if the customer attached one.
    // This is entirely optional — booking proceeds fine without it.
    let referenceImageUrl: string | null = null;

    if (referenceImage) {
      const fileExt = referenceImage.name.split(".").pop();
      const filePath = `appointments/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, referenceImage);

      if (uploadError) {
        setSubmitting(false);
        alert("We couldn't upload your reference image. Please try again, or book without it.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      referenceImageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("appointments").insert({
      user_id: user?.id ?? null,
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      garment_type: formData.get("garmentType"),
      preferred_date: formData.get("preferredDate"),
      preferred_time: activeSlot,
      notes: formData.get("notes"),
      reference_image_url: referenceImageUrl,
    });

    setSubmitting(false);
    if (!error) {
      setSubmitted(true);
    } else {
      alert("Something went wrong booking your fitting. Please try again.");
    }
  };

  if (submitted) {
    return (
      <>
        <ParallaxHero
          imageSrc="/designer-sketching.jpg"
          overlayClass="bg-ground/70"
          height="min-h-[40vh]"
        >
          <div className="flex flex-col items-center justify-center text-center px-6">
            <TextReveal
              text="You're Booked!"
              className="text-3xl sm:text-5xl md:text-7xl text-pure-white font-display mt-4"
            />
          </div>
        </ParallaxHero>
        <section className="bg-ivory py-20 px-6 text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-antique-gold/15 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-antique-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ground">
              Appointment Confirmed
            </h2>
            <p className="text-ground/70 font-sans text-sm leading-relaxed">
              Thank you for booking a fitting with G-Stitches. We've received your request and will be in touch to confirm your appointment time.
            </p>
            <p className="text-antique-gold text-sm font-sans font-semibold">
              Selected slot: {activeSlot}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href="/gallery"
                className="bg-ground text-ivory px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-signal-red transition-all duration-300 font-sans"
              >
                Browse Collection
              </Link>
              <Link
                href="/"
                className="border border-ground/30 text-ground px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-ground/5 transition-all duration-300 font-sans"
              >
                Return Home
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* ── PARALLAX HERO ── */}
      <ParallaxHero
        imageSrc="/designer-sketching.jpg"
        overlayClass="bg-ground/70"
        height="min-h-[65vh] sm:min-h-[55vh]"
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
            <p className="text-ivory/90 mt-4 max-w-md mx-auto text-center text-sm md:text-base leading-relaxed font-sans">
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
                  i > 0 ? "md:border-l-2 md:border-ground/25 md:pl-8" : ""
                }`}
              >
                <p className="text-5xl font-bold text-ground/20 font-sans">
                  {step.num}
                </p>
                <p className="text-xl font-semibold text-ground mt-2 font-sans">
                  {step.title}
                </p>
                <p className="text-sm text-ground/75 mt-2 leading-relaxed font-sans">
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

              <form className="mt-8 space-y-1" onSubmit={handleSubmit}>
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-ground/70 uppercase tracking-wider font-sans">
                      First name
                    </label>
                    <input name="firstName" type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ground/70 uppercase tracking-wider font-sans">
                      Last name
                    </label>
                    <input name="lastName" type="text" className={inputClass} />
                  </div>
                </div>

                {/* Contact row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-ground/70 uppercase tracking-wider font-sans">
                      Email
                    </label>
                    <input name="email" type="email" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ground/70 uppercase tracking-wider font-sans">
                      Phone
                    </label>
                    <input name="phone" type="tel" className={inputClass} />
                  </div>
                </div>

                {/* Select row */}
                <div>
                  <label className="text-xs font-semibold text-ground/70 uppercase tracking-wider font-sans">
                    Select A
                  </label>
                  <select name="garmentType" className={inputClass}>
                    <option value="">-- Choose an option --</option>
                    <option value="bridal">Bridal Wear</option>
                    <option value="casual">Casual Wear</option>
                    <option value="formal">Formal Wear</option>
                    <option value="traditional">Traditional Wear</option>
                  </select>
                </div>

                {/* ── REFERENCE IMAGE (OPTIONAL) ── */}
                <div className="pt-8">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-antique-gold tracking-[0.2em] font-sans">
                      REFERENCE IMAGE
                    </p>
                    <span className="text-[10px] font-semibold text-ground/50 border border-ground/25 rounded-full px-2 py-0.5 uppercase tracking-wider font-sans">
                      Optional
                    </span>
                  </div>
                  <p className="text-sm text-ground/70 mt-2 font-sans">
                    Have a design in mind? Upload a photo or sketch and we'll
                    bring it to life during your fitting.
                  </p>

                  {!previewUrl ? (
                    <label
                      htmlFor="referenceImage"
                      className="mt-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-ground/25 rounded-2xl py-10 px-6 text-center cursor-pointer hover:border-antique-gold hover:bg-antique-gold/5 transition-all duration-300"
                    >
                      <svg
                        className="w-8 h-8 text-ground/40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 8.25L12 3.75m0 0L7.5 8.25M12 3.75v13.5"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-ground font-sans">
                        Click to upload an image
                      </span>
                      <span className="text-xs text-ground/50 font-sans">
                        PNG or JPG, up to {MAX_IMAGE_MB}MB
                      </span>
                      <input
                        ref={fileInputRef}
                        id="referenceImage"
                        name="referenceImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="mt-4 flex items-center gap-4 border-2 border-ground/15 rounded-2xl p-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={previewUrl}
                          alt="Reference upload preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ground font-sans truncate">
                          {referenceImage?.name}
                        </p>
                        <p className="text-xs text-ground/50 font-sans">
                          Image attached
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-xs font-semibold text-ground/60 hover:text-signal-red uppercase tracking-wider font-sans shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {imageError && (
                    <p className="text-xs text-signal-red mt-2 font-sans">
                      {imageError}
                    </p>
                  )}
                </div>

                {/* ── SCHEDULE ── */}
                <div>
                  <p className="text-xs font-semibold text-antique-gold tracking-[0.2em] mt-10 font-sans">
                    SCHEDULE
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="text-xs font-semibold text-ground/70 uppercase tracking-wider font-sans">
                        Preferred Date
                      </label>
                      <input
                        type="text"
                        name="preferredDate"
                        placeholder="DD / MM / YYYY"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ground/70 uppercase tracking-wider font-sans">
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
                  <p className="text-xs font-semibold text-ground/70 uppercase tracking-wider mt-6 font-sans">
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
                              : "border-2 border-ground/30 text-ground/75 hover:border-ground hover:text-ground"
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
                  <label className="text-xs font-semibold text-ground/70 uppercase tracking-wider font-sans">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    className="border-b-2 border-ground/25 py-4 w-full min-h-[100px] text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus:border-signal-red transition-colors duration-300 bg-transparent resize-y mt-1 text-ground font-sans"
                    placeholder="Any special requests or details..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-ground text-ivory py-4 rounded-full text-sm font-semibold tracking-[0.15em] uppercase hover:bg-signal-red transition-all duration-300 hover:shadow-lg w-full mt-6 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-ground"
                >
                  {submitting ? "BOOKING..." : "CONFIRM APPOINTMENT"}
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
                    className="flex items-start gap-3 text-sm text-ground/80 font-sans"
                  >
                    <span className="w-5 h-5 bg-antique-gold/15 text-antique-gold rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Map placeholder */}
              <div className="bg-ground/5 rounded-2xl h-[160px] w-full mt-6 flex items-center justify-center">
                <span className="text-sm text-ground/60 font-sans">Map Location</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}