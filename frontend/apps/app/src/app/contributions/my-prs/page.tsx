'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { AppSidebar } from "@/components/layout/AppSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { GitPullRequest, GitPullRequestDraft, MessageSquare, RefreshCw } from 'lucide-react'
import { useAccount } from '@particle-network/connectkit'
import type { TrackedPullRequest } from '@/lib/models/pull_requests'

export default function MyPRsPage() {
  const { address } = useAccount()
  const [prs, setPrs] = useState<TrackedPullRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [githubUsername, setGithubUsername] = useState<string | null>(null)

  const loadPrs = useCallback(async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/contributions/pull-requests?wallet=${encodeURIComponent(address)}`,
        { cache: 'no-store' }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? 'Failed to load PRs')
      setPrs(json.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load PRs')
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    const stored = localStorage.getItem('github_username')
    setGithubUsername(stored)
    if (address) loadPrs()
  }, [address, loadPrs])

  const handleSync = async () => {
    if (!address || !githubUsername) {
      setError('Connect wallet and save your GitHub username in Settings → Profile.')
      return
    }
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/github/sync-prs?username=${encodeURIComponent(githubUsername)}&wallet=${encodeURIComponent(address)}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sync failed')
      await loadPrs()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const openCount = prs.filter((p) => p.state === 'open').length
  const mergedCount = prs.filter((p) => p.state === 'merged').length
  const reviewCount = prs.filter((p) => p.state === 'closed').length

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
                  <BreadcrumbLink href="/contributions">Contributions</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>My PRs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <StatCard icon={GitPullRequest} label="Open PRs" value={String(openCount)} />
            <StatCard icon={GitPullRequestDraft} label="Closed" value={String(reviewCount)} />
            <StatCard icon={MessageSquare} label="Synced" value={String(prs.length)} />
            <StatCard icon={GitPullRequest} label="Merged" value={String(mergedCount)} />
          </div>

          <div className="min-h-[calc(100vh-16rem)] rounded-xl glass-effect p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">My Pull Requests</h2>
                <p className="text-sm text-gray-400 mt-1">
                  PRs on repos from challenges you joined are attributed here after sync.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSync}
                disabled={syncing || !address}
                className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing…' : 'Sync PRs'}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            {!address && (
              <p className="text-gray-400">Connect your wallet to view and sync pull requests.</p>
            )}

            {address && !githubUsername && (
              <p className="text-gray-400">
                Save your GitHub username in{' '}
                <Link href="/settings/profile" className="text-green-400 underline">Settings → Profile</Link>.
              </p>
            )}

            {loading && <p className="text-gray-400">Loading…</p>}

            <div className="space-y-4">
              {prs.map((pr) => (
                <div key={pr.id} className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <GitPullRequest className="w-5 h-5 text-green-400 shrink-0" />
                      <div className="min-w-0">
                        <a
                          href={pr.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-medium hover:text-green-400 truncate block"
                        >
                          {pr.title}
                        </a>
                        <p className="text-sm text-gray-400 truncate">
                          {pr.repoFullName} #{pr.prNumber}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm shrink-0 ${
                        pr.state === 'merged'
                          ? 'bg-green-500/20 text-green-400'
                          : pr.state === 'open'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {pr.state}
                    </span>
                  </div>
                </div>
              ))}
              {!loading && prs.length === 0 && address && githubUsername && (
                <p className="text-gray-400 text-center py-8">
                  No synced PRs yet. Join a challenge with a repo, open a PR, then click Sync PRs.
                </p>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="glass-effect p-6 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Icon className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
      </div>
    </div>
  )
}
