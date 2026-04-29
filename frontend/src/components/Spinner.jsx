export default function Spinner({ full = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }

  if (full) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream z-50">
        <div className={`${sizes.lg} border-2 border-ink-200 border-t-ink-700 rounded-full animate-spin`} />
      </div>
    )
  }

  return (
    <div className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
  )
}
