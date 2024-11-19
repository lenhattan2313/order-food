export default function GuestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="m-4">{children}</main>;
}
