import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles
import { OnboardingProvider } from './context/OnboardingContext';
import { ThemeProvider } from './context/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Spectrum AI — AI Visual Enhancement',
  description: 'Enhance, upscale, denoise, and restore images with professional-grade AI models. Spectrum AI powers your visual creativity.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload hero video so it starts buffering before React hydrates */}
        <link rel="preload" as="video" href="/13167255_trimmed_4s.mp4" type="video/mp4" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Intercept and absorb errors during the capture phase to prevent Next.js dev overlay from showing up
                window.addEventListener('error', function(event) {
                  const message = event.message || "";
                  if (
                    !message ||
                    message.includes("Script error") ||
                    message.includes("ResizeObserver") ||
                    (event.filename && !event.filename.includes(window.location.host))
                  ) {
                    console.warn("Muted cross-origin iframe / extension script error:", message);
                    try {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                    } catch(e) {}
                  }
                }, true);

                window.addEventListener('unhandledrejection', function(event) {
                  const reason = (event.reason && event.reason.message) || "";
                  console.warn("Muted unhandled promise rejection:", reason);
                  try {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                  } catch(e) {}
                }, true);

                window.onerror = function() {
                  return true;
                };

                window.onunhandledrejection = function(e) {
                  try {
                    e.preventDefault();
                  } catch(err) {}
                };
              })();
            `
          }}
        />
      </head>
      <body className="bg-[var(--bg-base)] text-[var(--text-main)] transition-colors duration-500" suppressHydrationWarning>
        <ThemeProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

