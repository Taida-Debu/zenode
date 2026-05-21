"use client"

import * as React from "react"
import Link from "next/link"
import { docsPath, landingPath } from "@zenode/ui/urls"
import {
   BookOpen,
   LifeBuoy,
   PieChart,
   Settings2,
   Award,
   GitPullRequest,
   Code,
   Wallet,
   Image,
   ArrowLeftRight,
} from "lucide-react"

import { NavMain } from "@/components/nav/NavMain"
import { NavProjects } from "@/components/nav/NavProjects"
import { NavSecondary } from "@/components/nav/NavSecondary"
import { SidebarAuthFooter } from "@/components/layout/SidebarAuthFooter"
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setUserAsync } from "@/context/redux/userSlice"
import { AppDispatch } from "@/context/redux/store"
import { setRepoAsync } from "@/context/redux/repoSlice"

const data = {
   user: {
      name: "developer",
      email: "dev@lazydev.io",
      avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=lazydev",
   },
   navMain: [
      {
         title: "Dashboard",
         url: "/dashboard",
         icon: PieChart,
         items: [
            {
               title: "Overview",
               url: "/dashboard/overview",
            },
            {
               title: "Projects",
               url: "/dashboard/projects",
            },
            {
               title: "Analytics",
               url: "/dashboard/analytics",
            },
            {
               title: "Submit Proposal",
               url: "/dashboard/submit-proposal",
            },
            {
               title: "Search",
               url: "/dashboard/search",
            },
         ],
      },
      {
         title: "Projects",
         url: "/projects",
         icon: Code,
         items: [
            {
               title: "Smart Contracts",
               url: "/projects/smart-contracts",
            },
            {
               title: "DeFi Integration",
               url: "/projects/defi",
            },
            {
               title: "NFT Marketplace",
               url: "/projects/nft",
            },
            {
               title: "Token Bridge",
               url: "/projects/token-bridge",
            }
         ],
      },
      {
         title: "Playground",
         url: "/playground",
         icon: Code,
         items: [
            {
               title: "Code Editor",
               url: "/playground/editor",
            },
            {
               title: "Smart Contracts",
               url: "/playground/smart-contracts",
            },
            {
               title: "Web3 Integration",
               url: "/playground/web3",
            },
            {
               title: "Challenges",
               url: "/playground/challenges",
            },
         ],
      },
      {
         title: "Contributions",
         url: "/contributions",
         icon: GitPullRequest,
         items: [
            {
               title: "My PRs",
               url: "/contributions/my-prs",
            },
            {
               title: "Issues",
               url: "/contributions/issues",
            },
            {
               title: "Rewards",
               url: "/contributions/rewards",
            },
         ],
      },
      {
         title: "Learn",
         url: "/learn",
         icon: BookOpen,
         items: [
            {
               title: "Tutorials",
               url: "/learn/tutorials",
            },
            {
               title: "Challenges",
               url: "/learn/challenges",
            },
            {
               title: "Resources",
               url: "/learn/resources",
            },
         ],
      },
      {
         title: "Settings",
         url: "/settings",
         icon: Settings2,
         items: [
            {
               title: "Profile",
               url: "/settings/profile",
            },
            {
               title: "Preferences",
               url: "/settings/preferences",
            },
            {
               title: "Notifications",
               url: "/settings/notifications",
            },
            {
               title: "Security",
               url: "/settings/security",
            }
         ],
      },
   ],
   navSecondary: [
      {
         title: "Support",
         url: "/support",
         icon: LifeBuoy,
      },
      {
         title: "Documentation",
         url: docsPath("/"),
         icon: BookOpen,
         external: true,
      },
   ],
   projects: [
      {
         name: "Smart Contracts",
         url: "/projects/smart-contracts",
         icon: Code,
      },
      {
         name: "DeFi Integration",
         url: "/projects/defi",
         icon: Wallet,
      },
      {
         name: "NFT Marketplace",
         url: "/projects/nft",
         icon: Image,
      },
      {
         name: "Token Bridge",
         url: "/projects/token-bridge",
         icon: ArrowLeftRight,
      }
   ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   // const [user, setUser] = useState<any>({
   //    name: "",
   //    avatar_url: "",
   // });
   // console.log(user)
   // useEffect(() => {
   //    const fetchUser = async () => {

   //       // const octokit = app.getInstallationOctokit();
   //       // const ress = await octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
   //       //    owner: "github",
   //       //    repo: "docs",
   //       //    issue_number: 11901,
   //       // });
   //       // console.log(ress);
   //       const username = "nyuiela";
   //       const response = await fetch(`https://api.github.com/users/${username}`);
   //       const data = await response.json();
   //       setUser(data);
   //       return data
   //    }
   //    fetchUser();
   // }, []);
   const dispatch = useDispatch<AppDispatch>();

   useEffect(() => {
      const bootstrap = async () => {
         const storedUsername =
            typeof window !== 'undefined' ? localStorage.getItem('github_username') : null;
         if (!storedUsername) return;
         const updatedUser = await dispatch(setUserAsync(storedUsername)).unwrap();
         if (updatedUser?.installation_id) {
            await dispatch(
               setRepoAsync({
                  username: storedUsername,
                  userId: String(updatedUser.installation_id),
               })
            );
         }
      };
      bootstrap();
   }, [dispatch]);

   return (
      <Sidebar variant="inset" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                     <Link href={landingPath('/')}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-500/20">
                           <Award className="size-4 text-green-400" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-semibold gradient-text">Zenode</span>
                           <span className="truncate text-xs text-gray-400">Web3 Development</span>
                        </div>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
            <NavProjects projects={data.projects} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
         </SidebarContent>
         <SidebarFooter>
            <SidebarAuthFooter />
         </SidebarFooter>
      </Sidebar>
   )
}
