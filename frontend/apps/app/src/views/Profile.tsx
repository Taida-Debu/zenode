"use client"
import React, { useState } from 'react';
import { User, Mail, Link as LinkIcon, Upload, ChevronDown, MapPin, X, GitBranch, GitCommit } from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/context/redux/store';
import { UserAvatar } from '@zenode/ui/user-avatar';
import { useAccount } from '@particle-network/connectkit';
import { setUserAsync } from '@/context/redux/userSlice';
import { setRepoAsync } from '@/context/redux/repoSlice';

export default function Profile() {
   const user = useSelector((state: RootState) => state.user.user);
   const dispatch = useDispatch<AppDispatch>();
   const { address } = useAccount();
   const [avatar, setAvatar] = useState<string | null>(user?.avatar_url as string);
   const [githubUsername, setGithubUsername] = useState('');
   const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
   const [experience, setExperience] = useState<string>("Select years of experience");

   React.useEffect(() => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('github_username') : null;
      if (stored) setGithubUsername(stored);
      else if (user?.login) setGithubUsername(user.login);
   }, [user?.login]);

   const experienceOptions = [
      "Less than 1 year",
      "1-2 years",
      "2-5 years",
      "5-10 years",
      "10+ years"
   ];

   const handleSaveGithubUsername = async () => {
      const login = githubUsername.trim();
      if (!login) return;
      setSaveStatus('saving');
      try {
         localStorage.setItem('github_username', login);
         if (address) {
            const res = await fetch('/api/users/profile', {
               method: 'PATCH',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ walletAddress: address, githubUsername: login }),
            });
            if (!res.ok) {
               const body = await res.json().catch(() => ({}));
               throw new Error(body?.error ?? 'Failed to save profile');
            }
         }
         const updatedUser = await dispatch(setUserAsync(login)).unwrap();
         if (updatedUser.installation_id) {
            await dispatch(
               setRepoAsync({ username: login, userId: String(updatedUser.installation_id) })
            );
         }
         setSaveStatus('saved');
      } catch {
         setSaveStatus('error');
      }
   };

   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setAvatar(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="container mx-auto p-6">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-gray-400">This is how others will see you on the site.</p>
         </div>

         <div className="space-y-8">
            {/* Avatar Upload Section */}
            <div className="glass-effect p-6 rounded-xl max-w-sm ml-0">
               <h2 className="text-xl font-semibold text-white mb-4">Profile Picture</h2>
               <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
                     <UserAvatar
                        src={avatar || user?.avatar_url}
                        seed={githubUsername || user?.login || address || 'profile'}
                        name={user?.name || githubUsername || 'Profile'}
                        size={128}
                        className="w-full h-full rounded-lg"
                     />
                     {/* <label className="absolute bottom-0 right-0 p-1 bg-green-500/20 rounded-full cursor-pointer hover:bg-green-500/30 transition-colors">
                        <Upload className="w-4 h-4 text-green-400" />
                        <input
                           type="file"
                           className="hidden"
                           accept="image/*"
                           onChange={handleImageUpload}
                        />
                     </label> */}
                  </div>
                  <div className="text-sm text-gray-400">
                     GitHub Profile Image
                  </div>
               </div>
            </div>

            {/* GitHub username (required for PR tracking) */}
            <div className="glass-effect p-6 rounded-xl space-y-4 max-w-xl">
               <h2 className="text-xl font-semibold text-white">GitHub account</h2>
               <p className="text-sm text-gray-400">
                  Link your GitHub username so we can load repos and attribute pull requests to challenges you join.
               </p>
               <label className="block">
                  <span className="text-white">GitHub username</span>
                  <input
                     type="text"
                     value={githubUsername}
                     onChange={(e) => setGithubUsername(e.target.value)}
                     placeholder="e.g. octocat"
                     className="mt-1 w-full bg-black/40 border border-gray-800 rounded-lg py-2 px-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
               </label>
               <button
                  type="button"
                  onClick={handleSaveGithubUsername}
                  disabled={!githubUsername.trim() || saveStatus === 'saving'}
                  className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
               >
                  {saveStatus === 'saving' ? 'Saving…' : 'Save GitHub username'}
               </button>
               {saveStatus === 'saved' && (
                  <p className="text-sm text-green-400">Saved. Sidebar and repos will refresh.</p>
               )}
               {saveStatus === 'error' && (
                  <p className="text-sm text-red-400">Could not save. Check username and GitHub App config.</p>
               )}
            </div>

            {/* Profile Information */}
            <div className="glass-effect p-6 rounded-xl space-y-6">
               <div className="space-y-4">
                  <label className="block">
                     <span className="text-white">Display name</span>
                     <div className="mt-1 relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                           type="text"
                           placeholder="Your username"
                           className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                           disabled
                           value={user?.name as string}
                        />
                     </div>
                     <p className="text-sm text-gray-400 mt-1">
                        This is your public display name. It can be your real name or a pseudonym.
                     </p>
                  </label>
                  <label className="block">
                     <span className="text-white">Username</span>
                     <div className="mt-1 relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                           type="text"
                           placeholder="Your username"
                           className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                           disabled
                           value={user?.login as string}
                        />
                     </div>
                     <p className="text-sm text-gray-400 mt-1">
                        This is your username.
                     </p>
                  </label>

                  {user?.email && (
                     <label className="block">
                        <span className="text-white">Email</span>
                        <div className="mt-1 relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input
                              type="email"
                              placeholder="Select a verified email to display"
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                              disabled
                              value={user?.email as string}
                           />
                        </div>
                        {/* <p className="text-sm text-gray-400 mt-1">
                           You can manage verified email addresses in your email settings.
                        </p> */}
                     </label>
                  )}

                  <label className="block">
                     <span className="text-white">Bio</span>
                     <textarea
                        placeholder="Tell us about yourself"
                        className="mt-1 w-full bg-black/40 border border-gray-800 rounded-lg py-2 px-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 min-h-[100px]"
                        disabled
                        value={user?.bio as string}
                     />
                     <p className="text-sm text-gray-400 mt-1">
                        You can @mention other users and organizations to link to them.
                     </p>
                  </label>

                  {user?.location && (
                     <label className="block">
                        <span className="text-white">Location</span>
                        <div className="mt-1 relative">
                           <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input
                              type="text"
                              placeholder="Your location"
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                              disabled
                              value={user?.location || ''}
                           />
                        </div>
                     </label>
                  )}

                  {user?.blog && (
                     <label className="block">
                        <span className="text-white">Website</span>
                        <div className="mt-1 relative">
                           <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <a
                              href={user?.blog}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 block"
                           >
                              {user?.blog}
                           </a>
                        </div>
                     </label>
                  )}

                  {user?.twitter_username && (
                     <label className="block">
                        <span className="text-white">Twitter</span>
                        <div className="mt-1 relative">
                           <X className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <a
                              href={`https://x.com/${user?.twitter_username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 block"
                           >
                              {user?.twitter_username}
                           </a>
                        </div>
                     </label>
                  )}

                  {user?.public_gists !== null && (
                     <label className="block">
                        <span className="text-white">Public Gists</span>
                        <div className="mt-1 relative">
                           <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input
                              type="number"
                              placeholder="Number of public gists"
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                              disabled
                              value={user?.public_gists as number}
                           />
                        </div>
                     </label>
                  )}

                  {user?.public_repos !== null && (
                     <label className="block">
                        <span className="text-white">Public Repos</span>
                        <div className="mt-1 relative">
                           <GitCommit className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input
                              type="number"
                              placeholder="Number of public repositories"
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                              disabled
                              value={user?.public_repos as number}
                           />
                        </div>
                     </label>
                  )}

                  {user?.followers !== null && (
                     <label className="block">
                        <span className="text-white">Followers</span>
                        <div className="mt-1 relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input
                              type="number"
                              placeholder="Number of followers"
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                              disabled
                              value={user?.followers as number}
                           />
                        </div>
                     </label>
                  )}

                  {user?.following !== null && (
                     <label className="block">
                        <span className="text-white">Following</span>
                        <div className="mt-1 relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input
                              type="number"
                              placeholder="Number of following"
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                              disabled
                              value={user?.following as number}
                           />
                        </div>
                     </label>
                  )}
               </div>

               <div className="flex justify-end">
                  {/* <button className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                     Save Changes
                  </button> */}
               </div>
            </div>
         </div>
      </div>
   );
}