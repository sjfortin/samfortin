'use client'

import { useState } from 'react'
import { AnimatedLogo } from './AnimatedLogo'
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
  SheetHeader,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Home', href: '/' },
  // { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  // { name: 'Blog', href: '/blog' },
  { name: 'Playlists', href: '/playlists' },
  { name: 'Reader', href: '/reader' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <header>
      <nav aria-label="Global" className="mx-auto flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="font-semibold text-base/7 sr-only">Sam Fortin</span>
            <AnimatedLogo className='rounded-full' />
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
              <button className="cursor-pointer text-sm px-2 py-0.5 border border-gray-200 dark:border-gray-800 text-black dark:text-white">
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
        <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col py-2 [&>button:first-of-type]:hidden">
          <SheetHeader className="flex p-2">
            <SheetTitle>
              <span className="sr-only">Sam Fortin</span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigate to different sections of the site
            </SheetDescription>
            <SheetClose asChild className="self-end">
              <Button variant="ghost" ><XMarkIcon className="size-6" /></Button>
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-2 items-center">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <LogoMark width={80} height={80} className='rounded-full' />
              </Link>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-xl font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex justify-center mt-3">
                <ThemeSwitcher />
              </div>
            </div>

            <SheetFooter>
              <SignedOut>
                <SignInButton>
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SheetClose asChild>
                <Button variant="default">Close</Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
