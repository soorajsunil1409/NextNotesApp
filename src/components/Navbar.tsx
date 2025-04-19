"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const { data: session, status } = useSession();

    const handleSignIn = () => {
        signIn("google");
    };

    return (
        <div className="p-8 px-10 flex text-center justify-between items-center">
            <div className="text-2xl flex text-primary">
                <div className="font-bold">Note</div>Keeper
            </div>
            <input
                type="text"
                className="p-3 px-6 bg-secondary w-[300px] outline-0 text-primary rounded-3xl"
                placeholder="Search"
            />
            <div className="flex gap-3">
                {status === "authenticated" ? (
                    <div className="flex items-center gap-3">
                        <div className="text-primary dark:text-primary-foreground">
                            {session?.user?.name}
                        </div>
                        <div className="size-[50px] bg-secondary text-primary rounded-full overflow-hidden">
                            <Image
                                src={`${session?.user?.image}`}
                                height={50}
                                width={50}
                                alt="sdf"
                            />
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="px-5 py-3 rounded-2xl bg-secondary text-primary"
                        >
                            SignOut
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleSignIn}
                        className="px-5 py-3 rounded-2xl bg-secondary text-primary"
                    >
                        SignIn
                    </button>
                )}
                <ThemeToggle />
            </div>
        </div>
    );
};
export default Navbar;
