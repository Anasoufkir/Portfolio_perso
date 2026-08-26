import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Anas Oufkir — Ingénieur DevOps & Cloud AWS | Paris",
    template: "%s | Anas Oufkir",
  },
  description: "Ingénieur DevOps & Cloud AWS basé à Paris. Expert infrastructure cloud (EC2, RDS, S3, IAM, VPC), CI/CD GitLab (+30% productivité), Terraform, Kubernetes, Proxmox, Prometheus, Grafana, Loki. Couche AI-Ops innovante. Disponible immédiatement en CDI.",
  keywords: ["DevOps", "Cloud AWS", "Kubernetes", "Terraform", "GitLab CI/CD", "Proxmox", "Prometheus", "Grafana", "Loki", "Ansible", "Docker", "SRE", "Platform Engineering", "AI-Ops", "Anas Oufkir", "Paris", "ingénieur DevOps Paris", "consultant cloud AWS France"],
  authors: [{ name: "Anas Oufkir", url: "https://anasoufkir.com" }],
  creator: "Anas Oufkir",
  publisher: "Anas Oufkir",
  metadataBase: new URL("https://anasoufkir.com"),
  alternates: { canonical: "https://anasoufkir.com" },
  openGraph: {
    type: "website",
    url: "https://anasoufkir.com",
    title: "Anas Oufkir — Ingénieur DevOps & Cloud AWS | Paris",
    description: "Ingénieur DevOps & Cloud AWS basé à Paris. Expert Terraform, Kubernetes, Prometheus, Grafana. Disponible en CDI.",
    siteName: "Anas Oufkir Portfolio",
    locale: "fr_FR",
    images: [{ url: "/photo.jpg", width: 800, height: 800, alt: "Anas Oufkir — Ingénieur DevOps & Cloud AWS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anas Oufkir — Ingénieur DevOps & Cloud AWS",
    description: "Expert infrastructure cloud AWS, CI/CD, Terraform, Kubernetes. Disponible en CDI à Paris.",
    images: ["/photo.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  verification: { google: "mDvFCiFRndcS3eljhsN2-h30N8KZK-B7Y8NViBNaZYA" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Anas Oufkir",
              url: "https://anasoufkir.com",
              image: "https://anasoufkir.com/photo.jpg",
              jobTitle: "Ingénieur DevOps & Cloud AWS",
              worksFor: { "@type": "Organization", name: "Kazacube" },
              address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
              sameAs: [
                "https://github.com/Anasoufkir",
                "https://www.linkedin.com/in/anasoufkir"
              ],
              knowsAbout: ["AWS", "Kubernetes", "Terraform", "Docker", "Prometheus", "Grafana", "GitLab CI/CD", "DevOps"],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
