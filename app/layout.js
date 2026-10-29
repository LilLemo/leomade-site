import "./globals.css";
import "./studio.css";
import "./impact.css";
import { LightArrival } from "./components/ModeSwitch";
import { RevealObserver, ScrollProgress } from "./components/Motion";

export const metadata = {
  title: "LEOMADE | Made with curiosity",
  description:
    "A LEOMADE é meu estúdio independente de software, IA e experimentação. Aqui compartilho os produtos que crio, as ideias que estou tirando do papel e as ferramentas que já construí para outras áreas.",
  openGraph: {
    title: "LEOMADE | Made with curiosity",
    description: "Na LEOMADE, meu estúdio independente, transformo curiosidade em software e experimento ideias com IA.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary", title: "LEOMADE | Made with curiosity", description: "Meu estúdio de software, IA e experimentação. Conheça as ideias que estou tirando do papel." },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body><LightArrival /><ScrollProgress /><RevealObserver />{children}</body>
    </html>
  );
}
