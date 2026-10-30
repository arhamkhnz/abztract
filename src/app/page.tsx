import { Suspense } from "react";
import { Generator } from "./_components/generator";
import { SITE } from "./_lib/site";

const application = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE.url}#app`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and a modern web browser",
  isAccessibleForFree: true,
  sameAs: SITE.sourceUrl,
  image: new URL("opengraph-image", SITE.url).href,
  author: { "@type": "Person", name: SITE.author, url: SITE.authorUrl },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Abztract: geometric artwork generator</h1>
      <p className="sr-only">{SITE.description}</p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(application).replace(/</g, "\\u003c") }}
      />
      <Suspense fallback={null}>
        <Generator />
      </Suspense>
    </>
  );
}
