import { getServerSession } from "next-auth";
import { authOption } from "./auth";
import { NextRequest } from "next/server";

export async function requireAuth(_request: NextRequest) {
    const session = await getServerSession(authOption);

    if (!session || !session.user?.email) {
        throw new Error("Unauthorized");
    }

    return session;
}