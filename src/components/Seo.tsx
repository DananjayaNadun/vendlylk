import React from 'react';
import Head from 'expo-router/head';

/**
 * Per-route document metadata.
 *
 * Every page shipped with the same `<title>Vendly OrderFlow</title>` and no
 * description, so search results and link previews could not tell the Terms
 * page from the Electronics page. Each route now states its own.
 *
 * Native has no document head; `expo-router/head` no-ops there, so this is
 * safe to render unconditionally.
 */
const SITE = 'Vendly.lk';
const DEFAULT_DESCRIPTION =
  'Vendly.lk is the operating system for Sri Lankan businesses selling through Facebook and WhatsApp — one storefront, one order queue, one set of customer records.';

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  /** Omit on pages that should not appear in search results. */
  noIndex = false,
}: {
  title?: string;
  description?: string;
  noIndex?: boolean;
}) {
  /* The home page reads as the brand alone; every other page is scoped to it,
     which is what a search result and a browser tab both want. */
  const full = title ? `${title} · ${SITE}` : `${SITE} — orders, storefront and inventory in one place`;

  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      {noIndex ? <meta name="robots" content="noindex" /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
