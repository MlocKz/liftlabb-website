export default function PhoneMockup({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative bg-card-2 rounded-[2.5rem] p-[8px]
                     shadow-xl shadow-black/40 ring-1 ring-white/[0.05] ${className}`}
         style={{ aspectRatio: "9 / 19.5" }}>
      {/* Inner screen */}
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-bg
                      ring-1 ring-white/[0.05]">
        {/* Dynamic island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2
                        w-[70px] h-[22px] bg-card-2 rounded-full z-10" />
        {/* Content */}
        <div className="w-full h-full">
          {children}
        </div>
        {/* Screen reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
