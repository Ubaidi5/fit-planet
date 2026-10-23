import { cn } from "@/lib/utils";

// Small building blocks for the admin console. The console is internal, so its copy is English only.

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-7", className)}>{children}</section>;
}

export function PageTitle({ title, text }: { title: string; text?: string }) {
  return (
    <div>
      <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{title}</h1>
      {text && <p className="mt-1 text-gray-500">{text}</p>}
    </div>
  );
}

const tones = {
  green: "bg-emerald-50 text-emerald-800 ring-emerald-600/15",
  amber: "bg-amber-50 text-amber-900 ring-amber-600/15",
  red: "bg-red-50 text-red-700 ring-red-600/15",
  gray: "bg-canvas text-gray-600 ring-gray-900/[0.08]",
  blue: "bg-sky-50 text-sky-800 ring-sky-600/15",
} as const;

export function Pill({ tone = "gray", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ring-1", tones[tone])}>{children}</span>;
}

/** A one-button form posting hidden fields to a server action */
export function ActionButton({
  action,
  fields,
  tone = "default",
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
  tone?: "default" | "danger" | "primary";
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="submit"
        className={cn(
          "h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold whitespace-nowrap ring-1 transition-colors",
          tone === "danger" && "bg-red-50 text-red-700 ring-red-600/15 hover:bg-red-100",
          tone === "primary" && "bg-ink text-white ring-ink hover:bg-gray-800",
          tone === "default" && "bg-canvas text-ink ring-gray-900/[0.08] hover:bg-gray-100",
        )}
      >
        {children}
      </button>
    </form>
  );
}

export function SearchBar({ q, placeholder, children }: { q: string; placeholder: string; children?: React.ReactNode }) {
  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        className="h-11 w-full rounded-full bg-surface px-5 text-[15px] text-ink shadow-soft ring-1 ring-gray-900/[0.06] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/40 sm:max-w-sm"
      />
      {children}
    </form>
  );
}

export function FilterLinks({ items, active }: { items: { key: string; label: string; href: string }[]; active: string }) {
  return (
    <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className={cn(
            "flex h-9 shrink-0 items-center rounded-full px-3.5 text-[13px] font-semibold ring-1 transition-colors",
            item.key === active ? "bg-emerald-600 text-white ring-emerald-600" : "bg-surface text-gray-600 ring-gray-900/[0.08] hover:text-ink",
          )}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-[1.75rem] bg-surface px-6 py-12 text-center text-sm text-gray-500 ring-1 ring-gray-900/[0.05]">{children}</p>;
}
