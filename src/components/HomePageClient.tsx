"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Note from "@/components/Note";
import type { INote } from "@/models/Note";
import { Plus, StickyNote, Search } from "lucide-react";
import {
    useMainAnimation,
    useNotesAnimation,
    useAddButtonAnimation,
} from "@/components/animations";
import { useSearchStore } from "@/stores/useSearchStore";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useSession } from "next-auth/react";

const AddNoteCard = dynamic(() => import("@/components/AddNoteCard"));

const EmptyState = ({ onAddNote }: { onAddNote: () => void }) => {
    const emptyStateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!emptyStateRef.current) return;

        gsap.fromTo(
            emptyStateRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    return (
        <div
            ref={emptyStateRef}
            className="col-span-full flex flex-col items-center justify-center py-16 px-10"
        >
            <div className="bg-secondary/50 rounded-full p-6 mb-6">
                <StickyNote className="w-12 h-12 text-primary/50" />
            </div>
            <h3 className="text-xl font-medium text-primary/80 mb-2">
                No notes yet
            </h3>
            <p className="text-primary/60 mb-6 text-center max-w-md">
                Create your first note to get started with NoteKeeper
            </p>
            <button
                onClick={onAddNote}
                className="flex items-center gap-2 bg-primary text-background px-5 py-2.5 rounded-lg hover:opacity-90 transition-all"
            >
                <Plus className="w-5 h-5" />
                Create Note
            </button>
        </div>
    );
};

const HomePageClient = ({ notes: initialNotes }: { notes: INote[] }) => {
    const [notes, setNotes] = useState<INote[]>(initialNotes);
    const [addNotesPressed, setAddNotesPressed] = useState<boolean>(false);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "marked">(
        "newest"
    );
    const { query } = useSearchStore();
    const { data: session } = useSession();

    const containerRef = useMainAnimation();
    const notesContainerRef = useNotesAnimation();
    const addButtonRef = useAddButtonAnimation();
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!headerRef.current) return;

        gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
        );
    }, []);

    const filteredNotes = useMemo(() => {
        const filtered = notes.filter(
            (note: INote) =>
                note.title.toLowerCase().includes(query.toLowerCase()) ||
                note.description.toLowerCase().includes(query.toLowerCase())
        );

        return [...filtered].sort((a, b) => {
            if (sortOrder === "marked" && a.marked !== b.marked) {
                return a.marked ? -1 : 1;
            }

            const dateA = new Date(a.date_added).getTime();
            const dateB = new Date(b.date_added).getTime();

            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });
    }, [notes, query, sortOrder]);

    const updateNotes = (newNote: INote) => {
        setNotes(
            notes.map((note) =>
                note.notes_id === newNote.notes_id ? newNote : note
            )
        );
    };

    const handleDeleteNote = (noteId: string) => {
        setNotes((prev) => prev.filter((n) => n.notes_id !== noteId));
    };

    const toggleViewMode = () => {
        setView((prev) => (prev === "grid" ? "list" : "grid"));
    };

    const handleSort = (sort: "newest" | "oldest" | "marked") => {
        setSortOrder(sort);
    };

    const showEmptyResults = filteredNotes.length === 0 && query.length > 0;
    const showEmptyState =
        notes.length === 0 && !addNotesPressed && !query.length;

    return (
        <div
            ref={containerRef}
            className="bg-background text-primary flex-grow md:pt-6 px-6 md:px-12"
        >
            <main className="max-w-6xl mx-auto">
                <div ref={headerRef} className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="md:text-3xl text-xl font-medium">
                            {session?.user?.name
                                ? `${session.user.name.split(" ")[0]}'s Notes`
                                : "My Notes"}
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-secondary rounded-lg overflow-hidden">
                                <button
                                    onClick={() => handleSort("newest")}
                                    className={`px-2 text-xs md:px-3 py-1.5 md:text-sm ${
                                        sortOrder === "newest"
                                            ? "bg-anti-contrast text-white"
                                            : "text-primary/70 hover:bg-primary/10"
                                    }`}
                                >
                                    Newest
                                </button>
                                <button
                                    onClick={() => handleSort("oldest")}
                                    className={`px-2 text-xs md:px-3 py-1.5 md:text-sm ${
                                        sortOrder === "oldest"
                                            ? "bg-anti-contrast text-white"
                                            : "text-primary/70 hover:bg-primary/10"
                                    }`}
                                >
                                    Oldest
                                </button>
                                <button
                                    onClick={() => handleSort("marked")}
                                    className={`px-2 text-xs md:px-3 py-1.5 md:text-sm ${
                                        sortOrder === "marked"
                                            ? "bg-anti-contrast text-white"
                                            : "text-primary/70 hover:bg-primary/10"
                                    }`}
                                >
                                    Marked
                                </button>
                            </div>
                            <button
                                onClick={toggleViewMode}
                                className="p-2 rounded-lg bg-secondary text-primary/70 hover:text-primary transition-colors"
                            >
                                {view === "grid" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line
                                            x1="3"
                                            y1="6"
                                            x2="21"
                                            y2="6"
                                        ></line>
                                        <line
                                            x1="3"
                                            y1="12"
                                            x2="21"
                                            y2="12"
                                        ></line>
                                        <line
                                            x1="3"
                                            y1="18"
                                            x2="21"
                                            y2="18"
                                        ></line>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="7"
                                            height="7"
                                        ></rect>
                                        <rect
                                            x="14"
                                            y="3"
                                            width="7"
                                            height="7"
                                        ></rect>
                                        <rect
                                            x="14"
                                            y="14"
                                            width="7"
                                            height="7"
                                        ></rect>
                                        <rect
                                            x="3"
                                            y="14"
                                            width="7"
                                            height="7"
                                        ></rect>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {query && (
                        <div className="flex items-center gap-2 mb-4 text-primary/70">
                            <Search className="w-4 h-4" />
                            <span>
                                {filteredNotes.length}{" "}
                                {filteredNotes.length === 1
                                    ? "result"
                                    : "results"}{" "}
                                for &quot;{query}&quot;
                            </span>
                        </div>
                    )}
                </div>

                {showEmptyResults && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="bg-secondary/50 rounded-full p-5 mb-4">
                            <Search className="w-10 h-10 text-primary/50" />
                        </div>
                        <h3 className="text-xl font-medium text-primary/80 mb-2">
                            No results found
                        </h3>
                        <p className="text-primary/60">
                            Try different keywords or clear your search
                        </p>
                    </div>
                )}

                {showEmptyState && (
                    <EmptyState onAddNote={() => setAddNotesPressed(true)} />
                )}

                {(filteredNotes.length > 0 || addNotesPressed) && (
                    <div
                        ref={notesContainerRef}
                        className={
                            view === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
                                : "flex flex-col gap-4 mb-24"
                        }
                    >
                        {addNotesPressed && (
                            <AddNoteCard
                                setAddNotesPressed={setAddNotesPressed}
                                setNotes={setNotes}
                            />
                        )}

                        {filteredNotes.map((note) => (
                            <Note
                                key={note.notes_id}
                                note={note}
                                onDelete={handleDeleteNote}
                                editNotes={updateNotes}
                                viewMode={view}
                            />
                        ))}
                    </div>
                )}
            </main>

            <button
                ref={addButtonRef}
                onClick={() => setAddNotesPressed((prev) => !prev)}
                className="fixed right-8 bottom-8 w-14 h-14 bg-primary text-background rounded-full flex justify-center items-center shadow-lg"
                aria-label="Add note"
            >
                <Plus className="w-8 h-8" />
            </button>
        </div>
    );
};

export default HomePageClient;
