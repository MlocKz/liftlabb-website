// components/PhoneMockup.tsx

export default function PhoneMockup({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative rounded-[36px] border-[3px] border-border bg-card overflow-hidden ${className}`}
      style={{ aspectRatio: "9 / 19.5" }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-bg rounded-b-2xl z-10" />
      {/* Screen content */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  )
}
