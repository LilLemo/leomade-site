import "./globals.css";
import "./studio.css";
import "./impact.css";
import "./switch.css";
import "./toys.css";
import { LightArrival, lightArrivalScript, themeScript } from "./components/ModeSwitch";
import { RevealObserver, ScrollProgress } from "./components/Motion";

export const metadata = {
  title: "LEOMADE | Made with curiosity",
  description:
    "Sou o Léo e a LEOMADE é meu estúdio de software, dados e IA. Aqui estão os produtos que crio, as ferramentas que construí para outras áreas e como eu trabalho.",
  openGraph: {
    title: "LEOMADE | Made with curiosity",
    description: "Na LEOMADE, meu estúdio independente, transformo curiosidade em software e experimento ideias com IA.",
    type: "website",
    locale: "pt_BR",
    url: "https://leomade.com.br/",
    siteName: "LEOMADE",
    images: [{ url: "https://leomade.com.br/og-image.jpg", width: 1200, height: 630, alt: "leomade✳ · Made with curiosity" }],
  },
  twitter: { card: "summary_large_image", title: "LEOMADE | Made with curiosity", description: "Meu estúdio de software, IA e experimentação. Conheça as ideias que estou tirando do papel.", images: ["https://leomade.com.br/og-image.jpg"] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: lightArrivalScript }} />
        {["instrument-serif", "instrument-serif-italic", "inter-regular", "inter-medium"].map(font => <link key={font} rel="preload" href={`/fonts/${font}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />)}
      </head>
      <body><LightArrival /><ScrollProgress /><RevealObserver />{children}</body>
    </html>
  );
}
