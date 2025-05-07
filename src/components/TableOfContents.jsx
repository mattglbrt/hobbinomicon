import { useEffect, useState } from "react";

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
              setActiveId(id);
            }
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );

    document.querySelectorAll("h2, h3").forEach((section) => observer.observe(section));

    return () => {
      document.querySelectorAll("h2, h3").forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <nav className="space-y-2 text-sm text-gray-700">
      {headings
        .filter((heading) => heading.depth === 2 || heading.depth === 3)
        .map((heading) => (
          <a
            key={heading.slug}
            href={`#${heading.slug}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(heading.slug);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`block transition-all duration-300 ease-in-out ${
              heading.depth === 3 ? "ml-4" : ""
            } ${activeId === heading.slug ? "text-red-600 font-semibold" : "text-gray-500 opacity-70"} ${
              heading.depth === 3 && activeId !== heading.slug ? "hidden" : ""
            }`}
          >
            {heading.text}
          </a>
        ))}
    </nav>
  );
}
