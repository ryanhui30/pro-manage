import React from "react";
import { Menu, Moon, Search, Sun, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollasped } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollasped,
    );
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const { data: currentUser } = useGetAuthUserQuery({});
    const handleSignOut = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    if (!currentUser) return null;
    const currentUserDetails = currentUser?.userDetails;

    return (
        <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
            {/* Search Bar */}
            <div className="flex items-center gap-8">
                {!isSidebarCollapsed ? null : (
                    <button onClick={() => dispatch(setIsSidebarCollasped(!isSidebarCollapsed))}>
                        <Menu className="h-8 w-8 dark:text-white" />
                    </button>
                )}

                <div className="relative flex h-min w-[200px]">
                    <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
                    <input
                        className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-non dark:bg-gray-700 dark:text-white dark:placeholder-white"
                        type="search"
                        placeholder="Search..."
                    />
                </div>
            </div>

            {/* Right Side - Hidden on mobile except dark mode toggle */}
            <div className="flex items-center gap-4">
                {/* Always visible dark mode toggle */}
                <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className={
                        isDarkMode
                            ? `rounded p-2 dark:hover:bg-gray-700`
                            : `rounded p-2 hover:bg-gray-100`
                    }
                >
                    {isDarkMode ? (
                        <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
                    ) : (
                        <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
                    )}
                </button>

                {/* Profile and sign out - hidden on mobile */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="min-h-[2em] w-[0.1rem] bg-gray-200"></div>
                    <Link href="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="flex h-9 w-9 justify-center">
                            {!!currentUserDetails?.profilePictureUrl ? (
                            <Image
                                src={`/${currentUserDetails?.profilePictureUrl}`}
                                alt={currentUserDetails?.username || "User Profile Picture"}
                                width={100}
                                height={50}
                                className="h-full rounded-full object-cover"
                            />
                            ) : (
                            <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
                            )}
                        </div>
                        <span className="text-gray-800 dark:text-white">
                            {currentUserDetails?.username}
                        </span>
                    </Link>
                    <button
                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 transition-colors"
                        onClick={handleSignOut}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
