export const metadata = {
  title: "My Site",
  description: "Awesome website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// Bu default değil, normal export
export function AnotherLayout() {
  return (...)
}
