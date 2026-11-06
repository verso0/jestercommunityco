import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

const LANGS = [
  { code: "en", label: "English" },
  { code: "ur", label: "اردو" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "es", label: "Español" },
];

function setCookie(v: string) {
  const host = window.location.hostname;
  const exp = v ? "" : "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=${v}; path=/${exp}`;
  document.cookie = `googtrans=${v}; path=/; domain=.${host}${exp}`;
}

export function LanguageSwitcher() {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const m = document.cookie.match(/googtrans=\/en\/(\w+)/);
    if (m?.[1]) setLang(m[1]);
    const w = window as unknown as { googleTranslateInit?: () => void; google?: { translate: { TranslateElement: new (o: object, id: string) => unknown } } };
    w.googleTranslateInit = () => {
      if (w.google) new w.google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: "en,ur,hi,bn,es", autoDisplay: false }, "google_translate_element");
    };
    if (!document.getElementById("gt-script")) {
      const s = document.createElement("script");
      s.id = "gt-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateInit";
      document.body.appendChild(s);
    }
  }, []);

  const choose = (code: string) => {
    setCookie(code === "en" ? "" : `/en/${code}`);
    window.location.reload();
  };

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]!;
  return (
    <div className="notranslate fixed bottom-4 left-4 z-[90]" translate="no">
      <div id="google_translate_element" className="hidden" />
      {open && (
        <ul className="mb-2 overflow-hidden rounded-md border border-primary/40 bg-card shadow-lg">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                onClick={() => choose(l.code)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-primary/20 ${l.code === lang ? "text-primary" : "text-foreground"}`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className="flex items-center gap-2 rounded-full border border-primary/50 bg-card px-4 py-2 text-sm text-foreground shadow-lg hover:bg-primary/20"
      >
        <Languages className="h-4 w-4" /> {current.label}
      </button>
    </div>
  );
}
