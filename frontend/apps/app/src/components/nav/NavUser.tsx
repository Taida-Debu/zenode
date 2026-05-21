"use client"

import {
   BadgeCheck,
   Bell,
   ChevronsUpDown,
   CreditCard,
   LogOut,
   Sparkles,
   User,
   Shield,
} from "lucide-react"

import { ZenodeAvatar } from "@/components/ui/zenode-avatar"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
   user,
}: {
   user?: {
      name: string
      email: string
      avatar_url?: string
      login?: string
   } | null
}) {
   const { isMobile } = useSidebar()

   if (!user?.name && !user?.email && !user?.login) {
      return null
   }

   const seed = user.login || user.name || user.email || 'user'

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                     <ZenodeAvatar
                        className="h-8 w-8 rounded-lg"
                        src={user.avatar_url}
                        seed={seed}
                        name={user.name}
                     />
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                     </div>
                     <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
               >
                  <DropdownMenuLabel className="p-0 font-normal">
                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <ZenodeAvatar
                           className="h-8 w-8 rounded-lg"
                           src={user.avatar_url}
                           seed={seed}
                           name={user.name}
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-semibold">{user.name}</span>
                           <span className="truncate text-xs">{user.email}</span>
                        </div>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem onClick={() => window.location.href = '/settings/profile'}>
                        <User />
                        Profile
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem onClick={() => window.location.href = '/settings/account'}>
                        <BadgeCheck />
                        Account
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => window.location.href = '/settings/security'}>
                        <Shield />
                        Security
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => window.location.href = '/settings/notifications'}>
                        <Bell />
                        Notifications
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/'}>
                     <LogOut />
                     Log out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   )
} 