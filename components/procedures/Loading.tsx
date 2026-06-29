export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 animate-fade-in">
      <span className="loading loading-spinner text-primary w-10" />
      <p className="text-base-content/40 text-sm tracking-wide">Loading...</p>
    </div>
  );
}
