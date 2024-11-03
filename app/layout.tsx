import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anas Oufkir — Ingénieur DevOps & Cloud AWS",
  description:
    "Portfolio d'Anas Oufkir, ingénieur DevOps & Cloud AWS basé à Paris. Expert infrastructure cloud AWS, CI/CD GitLab, Terraform, Kubernetes, Proxmox, Prometheus, Grafana et Loki. Disponible immédiatement en CDI.",
  keywords: ["DevOps", "Cloud AWS", "Kubernetes", "Terraform", "GitLab CI/CD", "Proxmox", "Prometheus", "Grafana", "Loki", "Anas Oufkir", "Paris"],
  authors: [{ name: "Anas Oufkir", url: "https://anasoufkir.com" }],
  metadataBase: new URL("https://anasoufkir.com"),
  openGraph: {
    type: "website",
    url: "https://anasoufkir.com",
    title: "Anas Oufkir — Ingénieur DevOps & Cloud AWS",
    description: "Ingénieur DevOps & Cloud AWS basé à Paris. Proxmox, Prometheus, Grafana, Loki, Terraform, Kubernetes.",
    siteName: "Anas Oufkir Portfolio",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
