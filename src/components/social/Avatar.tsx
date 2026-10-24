import { cn } from "@/lib/utils";

const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-20 text-2xl" };

export function Avatar({ name, image, initials, size = "md", className }: { name: string; image: string | null; initials: string; size?: keyof typeof sizes; className?: string }) {
  return image ? (
    <img src={image} alt={name} className={cn("shrink-0 rounded-full object-cover", sizes[size], className)} referrerPolicy="no-referrer" />
  ) : (
    <span aria-label={name} className={cn("flex shrink-0 items-center justify-center rounded-full bg-volt font-semibold text-ink", sizes[size], className)}>
      {initials}
    </span>
  );
}
