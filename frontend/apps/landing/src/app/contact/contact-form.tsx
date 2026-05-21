'use client';

import Link from 'next/link';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { appPath } from '@zenode/ui/urls';

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <form
        className="glass-effect p-8 rounded-xl space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <label className="block">
          <span className="text-white text-sm">Name</span>
          <input
            required
            className="mt-1 w-full bg-black/40 border border-gray-800 rounded-lg py-2 px-4 text-white"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-white text-sm">Email</span>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              required
              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white"
              placeholder="you@example.com"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-white text-sm">Message</span>
          <div className="mt-1 relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              required
              rows={5}
              className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white"
              placeholder="How can we help?"
            />
          </div>
        </label>
        <button
          type="submit"
          className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send message
        </button>
        {sent && (
          <p className="text-sm text-green-400">
            Thanks — we&apos;ll get back to you. For product issues, also open a GitHub issue on the repo.
          </p>
        )}
      </form>

      <p className="mt-8 text-center text-gray-400">
        Ready to contribute?{' '}
        <Link href={appPath('/dashboard')} className="text-green-400 underline">
          Launch the app
        </Link>
      </p>
    </>
  );
}
