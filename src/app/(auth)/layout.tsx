export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'radial-gradient(circle at 20% 0%, #bcedda 0%, #f9faf7 45%)' }}
    >
      {children}
    </main>
  );
}
