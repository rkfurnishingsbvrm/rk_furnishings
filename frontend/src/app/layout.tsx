import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'RK Furnishings | Premium Home Furnishings in Bhimavaram',
  description:
    'Experience luxury interior furnishing with RK Furnishings. Curtains, blinds, sofa fabrics, wallpapers, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="cursor-none">
      <head>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js"></script>
      </head>

      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased bg-[#FFFFFF] text-[#2C2C2C] overflow-x-hidden cursor-none`}
        suppressHydrationWarning
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
