"use client";

import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import EditProfileModal from "./editProfileModal";

const navigation = [
  { name: "Home", href: "/", mustSignedIn: false },
  { name: "Leaderboard", href: "/leaderboard", mustSignedIn: false },
  { name: "My Scores", href: "/my-scores", mustSignedIn: true },
];

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const Navigations = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    "options" | "editUsername" | "editPassword"
  >("options");

  const handleSaveSuccess = () => {
    router.refresh();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0">
      <Disclosure
        as="nav"
        className="text-slate-900 dark:text-slate-500 bg-slate-500/90 dark:bg-slate-900/90 backdrop-blur-sm ring-1 ring-slate-900/10 dark:ring-black/10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <Link href={"/"} className="flex shrink-0 items-center">
                <Image
                  className="invert"
                  src="/img/scoreboard.svg"
                  alt="Next.js logo"
                  width={38}
                  height={38}
                  priority
                />
              </Link>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) =>
                    item.mustSignedIn ? (
                      <SignedIn key={item.name}>
                        <Link
                          href={item.href}
                          aria-current={
                            pathname === item.href ? "page" : undefined
                          }
                          className={classNames(
                            pathname === item.href
                              ? "bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-300"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}>
                          {item.name}
                        </Link>
                      </SignedIn>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                        className={classNames(
                          pathname === item.href
                            ? "bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-300"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}>
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <SignedOut>
                <a className="border py-1 px-3 rounded-md bg-white hover:bg-gray-700 hover:text-white block text-base font-medium">
                  <SignInButton mode="modal" />
                </a>
              </SignedOut>

              <SignedIn>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded bg-white hover:bg-gray-700 hover:text-white">
                    <p>{user?.username || "User"}</p>
                  </button>

                  {dropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                      <button
                        className="text-left block px-4 py-2 hover:bg-gray-100 w-full"
                        onClick={() => {
                          setDropdownOpen(false);
                          setIsModalOpen(true);
                        }}>
                        Edit Profile
                      </button>
                      <Link
                        href="/my-scores"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}>
                        Edit Scores
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          signOut();
                          setDropdownOpen(false);
                        }}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </SignedIn>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) =>
              item.mustSignedIn ? (
                <SignedIn key={item.name}>
                  <DisclosureButton
                    as="a"
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={classNames(
                      pathname === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}>
                    {item.name}
                  </DisclosureButton>
                </SignedIn>
              ) : (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={classNames(
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}>
                  {item.name}
                </DisclosureButton>
              )
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onSaveSuccess={handleSaveSuccess}
      />
    </header>
  );
};
