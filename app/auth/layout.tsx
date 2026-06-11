export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-6 text-foreground">
      <div className="w-full max-w-[400px]">{children}</div>
    </main>
  );
}
