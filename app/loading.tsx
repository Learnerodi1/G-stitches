export default function Loading() {
  return (
    <div className="min-h-screen bg-ground flex flex-col items-center justify-center gap-4">
      <p className="font-display text-2xl font-bold tracking-[0.2em] text-ivory">G-STITCHES</p>
      <div className="h-px w-16 bg-antique-gold/40" />
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-antique-gold/70 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
