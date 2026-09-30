interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="animate-fade-up">
        {eyebrow && (
          <p className="text-[13px] font-medium text-gray-500">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-[2.1rem]">
          {title}
        </h1>
        {description && <p className="mt-2 text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
