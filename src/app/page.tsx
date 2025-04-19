"use client";

import AddNoteCard from "@/components/AddNoteCard";
import { Note } from "@/components/Note";
import { INote } from "@/models/Note";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const HomePage = () => {
    const { data: session, status } = useSession();
    const [notes, setNotes] = useState<INote[]>([]);
    const [addNotesPressed, setAddNotesPressed] = useState<boolean>(false);

    useEffect(() => {
        const getNotes = async () => {
            try {
                const res = await fetch("/api/notes");
                const {
                    data: data,
                    message: message,
                }: { data: INote[]; message: String } = await res.json();

                if (res.ok) {
                    setNotes(data);
                    toast.success(message);
                } else {
                    toast.error(message);
                }
            } catch (err: any) {
                toast.error(err);
                console.log(err);
            }
        };

        getNotes();
    }, [status, session]);

    return (
        <div className="bg-secondary rounded-[50px] shadow-md h-[100vh]">
            <main className="p-[50px] h-full overflow-y-auto">
                <h1 className="text-3xl font-semibold mb-6">My Notes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-max mb-24">
                    {notes?.length === 0 &&
                        addNotesPressed === false &&
                        "No notes available..."}
                    {addNotesPressed && (
                        <AddNoteCard
                            setAddNotesPressed={setAddNotesPressed}
                            setNotes={setNotes}
                        />
                    )}
                    {notes?.map((note) => (
                        <Note key={note.notes_id} note={note} />
                    ))}
                </div>
            </main>
            <button
                onClick={() => setAddNotesPressed((prev) => !prev)}
                className="fixed right-[50px] bottom-[50px] size-[70px] bg-primary rounded-full flex justify-center items-center p-3 hover:opacity-[0.7]"
            >
                <Plus className="size-9 font-bold" />
            </button>
        </div>
    );
};

export default HomePage;
