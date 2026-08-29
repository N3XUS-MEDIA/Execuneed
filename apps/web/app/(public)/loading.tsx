export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="h-10 w-2/3 animate-pulse rounded-md bg-sand/60" />
      <div className="mt-4 h-6 w-full animate-pulse rounded-md bg-sand/40" />
      <div className="mt-2 h-6 w-5/6 animate-pulse rounded-md bg-sand/40" />
    </div>
  )
}
