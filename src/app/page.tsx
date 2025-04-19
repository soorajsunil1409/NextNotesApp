"use client";

import { Note } from "@/components/Note";
import type { INote } from "@/models/Note";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
    useMainAnimation,
    useNotesAnimation,
    useAddButtonAnimation,
} from "@/components/animations";
import { useSearchStore } from "@/stores/useSearchStore";
import dynamic from "next/dynamic";

const AddNoteCard = dynamic(() => import("@/components/AddNoteCard"));

const HomePage = () => {
    const { data: session, status } = useSession();
    const [notes, setNotes] = useState<INote[]>([]);
    const [addNotesPressed, setAddNotesPressed] = useState<boolean>(false);
    const { query } = useSearchStore();

    const containerRef = useMainAnimation();
    const notesContainerRef = useNotesAnimation();
    const addButtonRef = useAddButtonAnimation();

    const getNotes = useCallback(async () => {
        try {
            const res = await fetch("/api/notes");
            const { data, message }: { data: INote[]; message: string } =
                await res.json();

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
    }, []);

    useEffect(() => {
        if (status === "authenticated") getNotes();
    }, [status, getNotes]);

    const filteredNotes = useMemo(() => {
        return notes.filter(
            (note: INote) =>
                note.title.toLowerCase().includes(query.toLowerCase()) ||
                note.description.toLowerCase().includes(query.toLowerCase())
        );
    }, [notes, query]);

    return (
        <div
            ref={containerRef}
            className="bg-background text-gray-800 flex-grow pt-8 px-6 md:px-12"
        >
            <main className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-light mb-8 text-primary">
                    My Notes
                </h1>

                <div
                    ref={notesContainerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
                >
                    {addNotesPressed && (
                        <AddNoteCard
                            setAddNotesPressed={setAddNotesPressed}
                            setNotes={setNotes}
                        />
                    )}

                    {filteredNotes?.map((note) => (
                        <Note key={note.notes_id} note={note} />
                    ))}

                    {filteredNotes?.length === 0 && !addNotesPressed && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            No notes available. Click the + button to add your
                            first note.
                        </div>
                    )}
                </div>
            </main>

            <button
                ref={addButtonRef}
                onClick={() => setAddNotesPressed((prev) => !prev)}
                className="absolute right-8 bottom-8 w-14 h-14 bg-black text-white rounded-full flex justify-center items-center shadow-lg"
                aria-label="Add note"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
};

export default HomePage;
