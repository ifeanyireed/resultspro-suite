import './globals.css';
import "./nets.css";
import { ScrollRiseProvider } from "@/components/ScrollRiseProvider";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollRiseProvider>{children}</ScrollRiseProvider>
      </body>
    </html>
  );
}