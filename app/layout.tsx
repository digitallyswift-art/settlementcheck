import type { Metadata, Viewport } from 'next'
import { Source_Serif_4, Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    default: 'Settlement Agreement Calculator UK (2026) | SettlementCheck',
    template: '%s',
  },
  description:
    'Free settlement agreement calculator. Find out if your offer is fair in 60 seconds. Get matched with a vetted employment solicitor. Standard employer fee contributions apply upon completion.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/',
  },
  openGraph: {
    siteName: 'SettlementCheck',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SettlementCheck: UK Settlement Agreement Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon/', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    other: {
      'msvalidate.01': ['6BBF580BBE0BA7A27BDD225BD91A979F'],
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${sourceSerif4.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          id="gcm-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  var analytics = 'denied';
  var marketing = 'denied';
  try {
    var m = document.cookie.split('; ').find(function(r){ return r.indexOf('sc_cookie_consent=') === 0; });
    if (m) {
      var parsed = JSON.parse(decodeURIComponent(m.slice(18)));
      if (parsed && parsed.v === '2026-11') {
        if (parsed.analytics === true) analytics = 'granted';
        if (parsed.marketing === true) marketing = 'granted';
      }
    }
  } catch (e) {}
  gtag('consent', 'default', {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);
  try {
    var u = new URL(window.location.href);
    ['salary','offer','age','reason','discrimination','yearsNum','monthsNum','years','contractualNotice','offerIncludesNotice'].forEach(function(k){ u.searchParams.delete(k); });
    gtag('set', { page_location: u.toString() });
  } catch (e) {}
})();`,
          }}
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PC9K5T4B');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PC9K5T4B"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  )
}
