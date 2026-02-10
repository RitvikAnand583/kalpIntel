import "./globals.css";

export const metadata = {
  title: "KalpIntel Auth",
  description: "Secure Authentication System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
