"use client";

import { Note } from "@/components/Note";
import type { INote } from "@/models/Note";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
    useMainAnimation,
    useNotesAnimation,
    useAddButtonAnimation,
} from "@/components/animations";
import { useSearchStore } from "@/stores/useSearchStore";
import dynamic from "next/dynamic";

const AddNoteCard = dynamic(() => import("@/components/AddNoteCard"));

const HomePageClient = ({ notes: initialNotes }: { notes: INote[] }) => {
    const [notes, setNotes] = useState<INote[]>(initialNotes);
    const [addNotesPressed, setAddNotesPressed] = useState<boolean>(false);
    const { query } = useSearchStore();

    console.log(notes);

    const containerRef = useMainAnimation();
    const notesContainerRef = useNotesAnimation();
    const addButtonRef = useAddButtonAnimation();

    const filteredNotes = useMemo(() => {
        return notes.filter(
            (note: INote) =>
                note.title.toLowerCase().includes(query.toLowerCase()) ||
                note.description.toLowerCase().includes(query.toLowerCase())
        );
    }, [notes, query]);

    const handleDeleteNote = (noteId: string) => {
        setNotes((prev) => prev.filter((n) => n.notes_id !== noteId));
    };

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
                        <Note
                            key={note.notes_id}
                            note={note}
                            onDelete={handleDeleteNote}
                        />
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

export default HomePageClient;
