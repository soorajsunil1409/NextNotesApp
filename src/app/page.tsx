import { getServerSession } from "next-auth";
import { authOption } from "@/utils/auth";
import { getUserNotes } from "@/lib/notes";
import HomePageClient from "@/components/HomePageClient";
import LandingPage from "@/components/LandingPage";
import { INote } from "@/models/Note";

const HomePage = async () => {
    const session = await getServerSession(authOption);

    const email = session?.user?.email;

    if (email) {
        const notes: INote[] = await getUserNotes(email);
        const simplifiedNotes = notes.map((note) => ({
            notes_id: note.notes_id,
            email: note.email,
            title: note.title,
            description: note.description,
            date_added: note.date_added,
            marked: note.marked,
        }));

        return <HomePageClient notes={simplifiedNotes} />;
    }

    return <LandingPage />;
};

export default HomePage;
