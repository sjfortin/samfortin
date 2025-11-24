'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ThemeSwitcher } from './ThemeSwitcher'
import { LogoMark } from './LogoMark'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'AI Playlists', href: '/playlists' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="font-semibold text-base/7 sr-only">Sam Fortin</span>
            <LogoMark />
          </Link>
        </div>
        <div className={`flex lg:hidden gap-4 ${mobileMenuOpen ? 'hidden' : ''}`}>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-base/7 font-semibold text-black dark:text-white">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ThemeSwitcher />
          <SignedOut>
            <SignInButton>
              <button className="cursor-pointer text-sm px-2 py-0.5 rounded border border-gray-200 dark:border-gray-800 text-black dark:text-white">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col p-6" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate to different sections of the site
          </SheetDescription>
          
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Sam Fortin</span>
              <LogoMark />
            </Link>
            <div className="flex gap-4">
              <SheetClose asChild>
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </SheetClose>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-6 border-t pt-6 flex flex-col gap-6">
              <SignedOut>
                <SignInButton>
                  <button className="w-full rounded-lg bg-primary px-3 py-2 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <div className="flex justify-center">
                <ThemeSwitcher />
                
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
