import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Studeo — Ton admin, en clair.",
  description:
    "Studeo aide les étudiants belges à comprendre leur situation administrative, suivre leurs revenus et heures de travail, et anticiper leurs obligations fiscales. Simple, clair, rassurant.",
  keywords: [
    "étudiant belge",
    "job étudiant",
    "impôts étudiant",
    "heures étudiant",
    "650 heures",
    "fiscalité belge",
    "étudiant indépendant",
    "Belgique",
    "administration étudiante",
  ],
  openGraph: {
    title: "Studeo — Ton admin, en clair.",
    description: "L'app qui simplifie l'admin des étudiants belges.",
    type: "website",
    locale: "fr_BE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
