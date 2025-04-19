"use client";

import type { INote } from "@/models/Note";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNoteCardAnimation } from "./animations";
import gsap from "gsap";

export const Note = ({ note }: { note: INote }) => {
    const [currentNote, setCurrentNote] = useState<INote>(note);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const cardRef = useNoteCardAnimation();
    const statusBtnRef = useRef<HTMLButtonElement>(null);

    // Status button animation
    useEffect(() => {
        if (!statusBtnRef.current) return;

        gsap.fromTo(
            statusBtnRef.current,
            { scale: 0.9, opacity: 0.8 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "power1.out" }
        );
    }, [currentNote.marked]);

    const handleMarkedNote = async () => {
        try {
            if (isUpdating) return;

            setIsUpdating(true);

            const newNote = {
                ...currentNote,
                marked: !currentNote.marked,
            };

            const res = await fetch("/api/notes", {
                method: "PUT",
                body: JSON.stringify({
                    note_id: note.notes_id,
                    changes: { marked: newNote.marked },
                }),
            });

            const { message } = await res.json();

            if (res.ok) {
                // Status change animation
                gsap.to(statusBtnRef.current, {
                    scale: 1.1,
                    duration: 0.2,
                    onComplete: () => {
                        gsap.to(statusBtnRef.current, {
                            scale: 1,
                            duration: 0.2,
                        });
                    },
                });

                toast.success(message);
                setCurrentNote(newNote);
            } else {
                toast.error(message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div
            ref={cardRef}
            className="relative bg-secondary p-6 rounded-lg border-2 border-popover shadow-sm h-[250px] overflow-hidden transition-all"
        >
            <h2 className="text-xl font-medium mb-3 text-primary">
                {currentNote.title}
            </h2>
            <p className="text-primary-foreground line-clamp-5">
                {currentNote.description}
            </p>
            <button
                ref={statusBtnRef}
                onClick={handleMarkedNote}
                disabled={isUpdating}
                className={`absolute right-4 bottom-4 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                    currentNote.marked
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                }`}
            >
                {isUpdating
                    ? "Updating..."
                    : currentNote.marked
                    ? "Done"
                    : "Pending"}
            </button>
        </div>
    );
};
