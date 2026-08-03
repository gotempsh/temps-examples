// Next.js App Router requires a root layout; without it `next build` fails
// with "page.tsx doesn't have a root layout".
export const metadata = {
  title: "Temps Next.js Example",
  description: "Next.js App Router running on Temps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
