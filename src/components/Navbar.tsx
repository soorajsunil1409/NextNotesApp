"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
    const { data: session, status } = useSession();

    const handleSignIn = () => {
        signIn("google");
    };

    return (
        <div className="p-8 px-10 flex text-center justify-between items-center">
            <div className="text-4xl font-semibold">NOTES</div>
            <input
                type="text"
                className="p-3 px-6 bg-secondary w-[300px] outline-0 text-white rounded-3xl"
                placeholder="Search"
            />
            {status === "authenticated" ? (
                <div className="flex items-center gap-3">
                    <div>{session?.user?.name}</div>
                    <div className="size-[50px] bg-secondary rounded-full overflow-hidden">
                        <Image
                            src={`${session?.user?.image}`}
                            height={50}
                            width={50}
                            alt="sdf"
                        />
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="px-5 py-3 rounded-2xl bg-secondary"
                    >
                        SignOut
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleSignIn}
                    className="px-5 py-3 rounded-2xl bg-secondary"
                >
                    SignIn
                </button>
            )}
        </div>
    );
};
export default Navbar;
