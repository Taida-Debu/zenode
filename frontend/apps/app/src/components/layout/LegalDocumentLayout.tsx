'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { AppSidebar } from '@/components/layout/AppSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

type LegalDocumentLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalDocumentLayout({
  title,
  lastUpdated = 'May 2026',
  children,
}: LegalDocumentLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 pb-12 max-w-3xl">
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-sm text-gray-500 mt-2">Last updated: {lastUpdated}</p>
          </div>
          <article className="prose-docs space-y-6 text-gray-400 leading-relaxed">{children}</article>
          <p className="text-sm text-gray-500 border-t border-white/10 pt-6">
            Questions?{' '}
            <Link href="/support" className="text-green-400 underline hover:text-green-300">
              Contact support
            </Link>
            .
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
