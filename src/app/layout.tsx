import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/data/site";
import { publicFileExists } from "@/lib/media";
import { assetPath } from "@/lib/paths";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kai Zou — Navigation, autonomy & engineering", template: "%s | Kai Zou" },
  description: "Computer engineering at the intersection of navigation, autonomous systems, RF, and embedded computing. Selected engineering work by Kai Zou.",
  icons: { icon: assetPath("/icon.svg") },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const resumeUrl = site.resume && (site.resume.startsWith("https://") || publicFileExists(site.resume)) ? assetPath(site.resume) : undefined;
  return <html lang="en"><body className="min-h-screen antialiased"><a href="#main" className="skip-link">Skip to content</a><Header resumeUrl={resumeUrl} />{children}<Footer /></body></html>;
}
