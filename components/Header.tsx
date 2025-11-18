'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { ThemeSwitcher } from './ThemeSwitcher'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="font-semibold text-base/7 sr-only">Sam Fortin</span>
            <Image
              alt=""
              src="/logo.svg"
              width={100}
              height={24}
              className="h-8 w-auto dark:hidden hover:opacity-80"
            />
            <Image
              alt=""
              src="/logo-white.svg"
              width={100}
              height={24}
              className="h-8 w-auto hidden dark:block hover:opacity-80"
            />
          </Link>
        </div>
        <div className={`flex lg:hidden ${mobileMenuOpen ? 'hidden' : ''}`}>
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
            <Link key={item.name} href={item.href} className="text-base/7 font-semibold text-gray-900 dark:text-white">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ThemeSwitcher />
          <SignedOut>
            <SignInButton>
              <button className="cursor-pointer text-sm px-2 py-0.5 rounded border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-black p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Sam Fortin</span>
              <Image
                alt=""
                src="/logo.svg"
                width={100}
                height={24}
                className="h-8 w-auto dark:hidden"
              />
              <Image
                alt=""
                src="/logo-white.svg"
                width={100}
                height={24}
                className="h-8 w-auto hidden dark:block"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                <SignedIn>
                  <UserButton />
                </SignedIn>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-1 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                  >
                    {item.name}
                  </Link>
                ))}
                <SignedOut>
                  <div className="flex flex-row gap-2 w-full">
                    <SignInButton>
                      <button className="cursor-pointer block bg-gray-100 text-gray-900 px-2 py-1 rounded w-full">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                </SignedOut>
              </div>
              <div className="py-6 flex justify-center">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
