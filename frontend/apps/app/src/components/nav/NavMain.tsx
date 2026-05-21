"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { isExactPath, isNavGroupOpen } from "@/lib/nav-active"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  items?: {
    title: string
    url: string
    items?: {
      title: string
      url: string
    }[]
  }[]
}

function NavMainItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const childUrls = item.items?.map((s) => s.url) ?? []
  const groupOpen = isNavGroupOpen(pathname, item.url, childUrls)
  const parentActive = isExactPath(pathname, item.url)
  const [open, setOpen] = React.useState(groupOpen)

  React.useEffect(() => {
    setOpen(groupOpen)
  }, [groupOpen])

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.title} isActive={parentActive}>
          <Link href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
        {item.items?.length ? (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    {subItem.items ? (
                      <Collapsible defaultOpen={subItem.items.some((n) => isExactPath(pathname, n.url))}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton className="flex items-center justify-between">
                            <span>{subItem.title}</span>
                            <ChevronRight className="h-4 w-4" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="pl-4 pt-2">
                            {subItem.items.map((nestedItem) => (
                              <SidebarMenuSubItem key={nestedItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isExactPath(pathname, nestedItem.url)}
                                >
                                  <Link href={nestedItem.url}>
                                    <span>{nestedItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuSubButton
                        asChild
                        isActive={isExactPath(pathname, subItem.url)}
                      >
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    )}
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMainItem key={item.title} item={item} pathname={pathname} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
