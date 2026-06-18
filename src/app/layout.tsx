import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import GlobalOverlay from '@/components/GlobalOverlay';

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
    <html lang="en" className="cursor-none" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased bg-[#FFFFFF] text-[#2C2C2C] overflow-x-hidden cursor-none`}
        suppressHydrationWarning
      >
        <CustomCursor />
        <GlobalOverlay />
        {children}
      </body>
    </html>
  );
}
