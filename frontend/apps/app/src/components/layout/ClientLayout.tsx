'use client';

/** App shell: no marketing navbar — dashboard routes use AppSidebar. */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex-grow min-h-screen">{children}</main>;
}
