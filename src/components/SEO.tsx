// src/components/SEO.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Drop <SEO> into any page to set title, description and Open Graph tags.
// ─────────────────────────────────────────────────────────────────────────────
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product";
}

const SITE_NAME = "SLUT Clothing";
const DEFAULT_DESCRIPTION = "Unapologetically bold streetwear. Designed for those who refuse to blend in.";
const DEFAULT_IMAGE = "https://slut-clothing.vercel.app/og-image.jpg";
const BASE_URL = "https://slut-clothing.vercel.app";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
}: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} | Wear Your Truth`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph (WhatsApp, Facebook, LinkedIn previews) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}