"use client";

import { ReactNode, useState, useEffect } from "react";
import { useLenis } from "./lenis-provider";
import Script from "next/script";
import { CookieConsent } from "@/components/CookieConsent";

const gtmId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || null;
const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || null;

export function Providers({ children }: { children: ReactNode }) {
  useLenis();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("splitsquad-cookie-consent");
      if (stored === "accepted") setConsent(true);
    } catch { /* localStorage unavailable */ }
  }, []);

  return (
    <>
      <Script
        id="gtag-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
            });
          `,
        }}
      />

      {gtmId && consent && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {ga4Id && consent && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', {
                  analytics_storage: 'granted',
                  ad_storage: 'denied',
                });
              `,
            }}
          />
        </>
      )}

      {children}
      <CookieConsent />
    </>
  );
}
