export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="h-4 w-32 animate-pulse rounded-sm bg-sand" />
      <div className="mt-6 h-10 w-2/3 animate-pulse rounded-md bg-sand/70" />
      <div className="mt-5 h-6 w-full animate-pulse rounded-md bg-sand/50" />
      <div className="mt-2 h-6 w-5/6 animate-pulse rounded-md bg-sand/50" />
    </div>
  )
}
