export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute inset-0 bg-slate-100 z-0" />
      <img
        src="https://images.unsplash.com/photo-1519415943484-2fa1873496d4?q=80&w=2070&auto=format&fit=crop" // Subtle map background
        alt="Map background"
        className="absolute inset-0 w-full h-full object-cover opacity-10 z-0"
      />
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}