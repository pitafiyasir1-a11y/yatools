import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/site";

/** Server breadcrumb: Schema.org BreadcrumbList JSON-LD + visible trail. */
export default function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(items)) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol
          className="font-mono2 m-0 flex flex-wrap items-center gap-2 p-0 text-xs"
          style={{ listStyle: "none" }}
        >
          {items.map((item, i) => (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" style={{ color: "var(--muted)" }}>
                  /
                </span>
              )}
              {i === items.length - 1 ? (
                <span aria-current="page" style={{ color: "var(--text)" }}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="no-underline hover:underline"
                  style={{ color: "var(--muted)" }}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
