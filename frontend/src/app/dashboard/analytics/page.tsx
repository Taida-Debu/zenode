'use client'

import React from 'react'
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
import { TrendingUp, ArrowUpRight, Activity, Users, GitPullRequest } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts'
import { GitHubCalendar } from 'react-github-calendar'

const activityData = [
  { month: "Jan", contributions: 120 },
  { month: "Feb", contributions: 140 },
  { month: "Mar", contributions: 180 },
  { month: "Apr", contributions: 160 },
  { month: "May", contributions: 220 },
  { month: "Jun", contributions: 240 },
  { month: "Jul", contributions: 280 },
  { month: "Aug", contributions: 260 },
  { month: "Sep", contributions: 300 },
  { month: "Oct", contributions: 320 },
  { month: "Nov", contributions: 340 },
  { month: "Dec", contributions: 360 },
]

const contributionTypes = [
  { name: "Pull Requests", value: 45, color: "#4ade80" },
  { name: "Issues", value: 25, color: "#f87171" },
  { name: "Code Reviews", value: 20, color: "#a78bfa" },
  { name: "Documentation", value: 10, color: "#fb923c" },
]

const projectPerformance = [
  { project: "Smart Contracts", pullRequests: 30, issues: 15, codeReviews: 25 },
  { project: "DeFi Integration", pullRequests: 25, issues: 20, codeReviews: 15 },
  { project: "NFT Marketplace", pullRequests: 20, issues: 10, codeReviews: 30 },
]

export default function AnalyticsPage() {
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
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <StatCard icon={<Activity className="w-6 h-6 text-green-400" />} label="Activity Rate" value="85%" />
            <StatCard icon={<TrendingUp className="w-6 h-6 text-green-400" />} label="Growth" value="+24%" />
            <StatCard icon={<Users className="w-6 h-6 text-green-400" />} label="New Users" value="+156" />
            <StatCard icon={<GitPullRequest className="w-6 h-6 text-green-400" />} label="PR Success Rate" value="92%" />
          </div>

          <section className="glass-effect p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Contribution Activity</h3>
                <p className="text-sm text-gray-400">Contributions in the last year</p>
              </div>
            </div>
            <div className="py-4">
              <GitHubCalendar
                username="torvalds"
                colorScheme="dark"
                labels={{ totalCount: '{{count}} contributions in the last year' }}
                style={{ color: '#9CA3AF', backgroundColor: 'transparent' }}
              />
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="glass-effect p-6 rounded-xl">
              <ChartHeader title="Activity Overview" subtitle="Monthly contribution activity" />
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="contributions" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="glass-effect p-6 rounded-xl">
              <ChartHeader title="Contribution Types" subtitle="Distribution of contributions" />
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={contributionTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {contributionTypes.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="glass-effect p-6 rounded-xl md:col-span-2">
              <ChartHeader title="Project Performance" subtitle="Activity across all projects" />
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="project" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                    <Bar dataKey="pullRequests" name="Pull Requests" fill="#4ade80" />
                    <Bar dataKey="issues" name="Issues" fill="#f87171" />
                    <Bar dataKey="codeReviews" name="Code Reviews" fill="#a78bfa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-effect p-6 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-green-500/20 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
      </div>
    </div>
  )
}

function ChartHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
        <ArrowUpRight className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  )
}
