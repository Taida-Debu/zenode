import Link from 'next/link';
import type { ReactNode } from 'react';

export function DocSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-effect p-6 rounded-xl space-y-3">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="text-gray-400 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

export function DocCardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function DocCard({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="glass-effect p-5 rounded-xl block hover:bg-white/5 transition-colors group"
    >
      <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm mt-2">{children}</p>
    </Link>
  );
}

export function DocList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-2 text-gray-400">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function DocSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="list-decimal list-inside space-y-2 text-gray-400">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  );
}
