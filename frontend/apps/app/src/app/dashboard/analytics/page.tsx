'use client'

import React from 'react'
import { useSelector } from 'react-redux'
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
import { ResponsiveLine } from '@nivo/line'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar'
import { GitHubCalendar } from 'react-github-calendar'
import { RootState } from '@/context/redux/store'

const activityData = [
  {
    id: "contributions",
    color: "hsl(142, 70%, 50%)",
    data: [
      { x: "Jan", y: 120 },
      { x: "Feb", y: 140 },
      { x: "Mar", y: 180 },
      { x: "Apr", y: 160 },
      { x: "May", y: 220 },
      { x: "Jun", y: 240 },
      { x: "Jul", y: 280 },
      { x: "Aug", y: 260 },
      { x: "Sep", y: 300 },
      { x: "Oct", y: 320 },
      { x: "Nov", y: 340 },
      { x: "Dec", y: 360 },
    ],
  },
]

const contributionTypes = [
  { id: "Pull Requests", value: 45, color: "hsl(142, 70%, 50%)" },
  { id: "Issues", value: 25, color: "hsl(352, 70%, 50%)" },
  { id: "Code Reviews", value: 20, color: "hsl(262, 70%, 50%)" },
  { id: "Documentation", value: 10, color: "hsl(22, 70%, 50%)" },
]

const projectPerformance = [
  { project: "Smart Contracts", "Pull Requests": 30, "Issues": 15, "Code Reviews": 25 },
  { project: "DeFi Integration", "Pull Requests": 25, "Issues": 20, "Code Reviews": 15 },
  { project: "NFT Marketplace", "Pull Requests": 20, "Issues": 10, "Code Reviews": 30 },
]

const nivoTheme = {
  axis: {
    ticks: { text: { fill: '#9CA3AF' } },
    legend: { text: { fill: '#9CA3AF' } },
  },
  legends: { text: { fill: '#9CA3AF' } },
}

export default function AnalyticsPage() {
  const user = useSelector((state: RootState) => state.user.user)
  const calendarUsername = user?.login || 'torvalds'

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
                <p className="text-sm text-gray-400">
                  {user?.login ? `@${user.login}` : 'Set GitHub username in profile'}
                </p>
              </div>
            </div>
            <div className="py-4">
              <GitHubCalendar
                username={calendarUsername}
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
                <ResponsiveLine
                  data={activityData}
                  margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  curve="natural"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    legend: 'Month',
                    legendOffset: 36,
                    legendPosition: 'middle',
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    legend: 'Contributions',
                    legendOffset: -40,
                    legendPosition: 'middle',
                  }}
                  enableGridX={false}
                  enableGridY={false}
                  useMesh
                  theme={nivoTheme}
                />
              </div>
            </section>

            <section className="glass-effect p-6 rounded-xl">
              <ChartHeader title="Contribution Types" subtitle="Distribution of contributions" />
              <div className="h-[300px]">
                <ResponsivePie
                  data={contributionTypes}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  arcLabelsTextColor="#FFFFFF"
                  theme={nivoTheme}
                />
              </div>
            </section>

            <section className="glass-effect p-6 rounded-xl md:col-span-2">
              <ChartHeader title="Project Performance" subtitle="Activity across all projects" />
              <div className="h-[300px]">
                <ResponsiveBar
                  data={projectPerformance}
                  keys={['Pull Requests', 'Issues', 'Code Reviews']}
                  indexBy="project"
                  margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  colors={{ scheme: 'nivo' }}
                  axisTop={null}
                  axisRight={null}
                  labelTextColor="#FFFFFF"
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      translateX: 120,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemTextColor: '#9CA3AF',
                    },
                  ]}
                  theme={nivoTheme}
                />
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
      <button type="button" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
        <ArrowUpRight className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  )
}
