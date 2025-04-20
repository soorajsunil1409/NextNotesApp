import { getServerSession } from "next-auth";
import { authOption } from "./auth";

export async function requireAuth() {
    const session = await getServerSession(authOption);

    if (!session || !session.user?.email) {
        throw new Error("Unauthorized");
    }

    return session;
}