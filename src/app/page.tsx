import { getServerSession } from "next-auth";
import { authOption } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getUserNotes } from "@/lib/notes";
import HomePageClient from "@/components/HomePageClient";
import { INote } from "@/models/Note";

const HomePage = async () => {
    const session = await getServerSession(authOption);

    if (!session) redirect("/api/auth/signin");

    const notes: INote[] = await getUserNotes(session.user?.email!);

    const simplifiedNotes = notes.map((note) => ({
        notes_id: note.notes_id,
        email: note.email,
        title: note.title,
        description: note.description,
        date_added: note.date_added,
        marked: note.marked,
    }));

    return <HomePageClient notes={simplifiedNotes} />;
};

export default HomePage;
