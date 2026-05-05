import LoadingSpinner from "@/components/LoadingSpinner";

/** Next.js route-level loading UI — shown while the page suspends */
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <LoadingSpinner />
    </div>
  );
}
