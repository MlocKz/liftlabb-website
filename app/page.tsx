import TestAnimation from '@/components/TestAnimation'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-accent">LiftLabb</h1>
      <p className="text-muted">Design system is working -- Circular Std font should render here</p>
      <div className="bg-card border border-border rounded-card p-6">
        <p className="text-text">Card with design tokens: bg-card, border-border, rounded-card</p>
      </div>
      <div className="flex gap-4">
        <span className="text-accent">accent</span>
        <span className="text-yellow">yellow</span>
        <span className="text-red">red</span>
        <span className="text-blue">blue</span>
        <span className="text-muted">muted</span>
      </div>

      {/* Spacer to create scroll distance for animation test */}
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted">Scroll down to test Motion whileInView animation</p>
      </div>

      <TestAnimation />

      {/* Extra space after animation */}
      <div className="h-64" />
    </main>
  )
}
