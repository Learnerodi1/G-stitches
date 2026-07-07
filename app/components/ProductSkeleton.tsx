export default function ProductSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-ground animate-pulse">
      <div className="aspect-[3/4] bg-ivory/[0.08]" />
      <div className="p-4 sm:p-5 space-y-2.5">
        <div className="h-3 w-16 bg-ivory/[0.08] rounded" />
        <div className="h-4 w-3/4 bg-ivory/[0.08] rounded" />
        <div className="h-5 w-1/3 bg-ivory/[0.08] rounded" />
        <div className="h-10 w-full bg-ivory/[0.08] rounded-md mt-3" />
      </div>
    </div>
  );
}
