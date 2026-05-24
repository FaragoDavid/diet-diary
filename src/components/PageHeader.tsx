import type { ReactNode } from 'react';

export default function PageHeader({
  title,
  children,
  search,
}: {
  title?: string;
  children?: ReactNode;
  search?: ReactNode;
}) {
  return (
    <div className="sticky top-16 z-10 bg-base-200 -mx-4 px-4 py-2 space-y-2">
      <div className="flex items-center justify-between">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {children}
      </div>
      {search}
    </div>
  );
}
