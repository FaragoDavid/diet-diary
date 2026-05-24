import type { ReactNode } from 'react';

export default function PageHeader({ title, children, search }: { title?: string; children?: ReactNode; search?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-10">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {search}
      {children}
    </div>
  );
}
