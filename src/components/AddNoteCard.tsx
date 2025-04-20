"use client";

import type { INote } from "@/models/Note";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNoteCardAnimation } from "./animations";
import gsap from "gsap";
import { Plus } from "lucide-react";

interface IAddNoteCard {
    setAddNotesPressed: (v0: boolean) => void;
    setNotes: (v0: INote[] | ((prev: INote[]) => INote[])) => void;
}

const AddNoteCard = ({ setAddNotesPressed, setNotes }: IAddNoteCard) => {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const cardRef = useNoteCardAnimation();
    const addBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: -20 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
            }
        );
    }, []);

    const handleAdd = async () => {
        try {
            const now = new Date(Date.now())
                .toString()
                .split(" ")
                .slice(1, 5)
                .join(" ");

            const note = {
                notes_id: Date.now().toString(),
                title: title,
                email: session?.user?.email,
                description: description,
                date_added: now,
                marked: false,
            };
            setNotes((prev) => [note as INote, ...prev]);

            const res = await fetch("/api/notes", {
                method: "POST",
                body: JSON.stringify(note),
            });

            const { data, message } = await res.json();

            if (res.ok) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (err: any) {
            console.log(err);
            toast.error(err);
        }
    };

    const handleAddNote = () => {
        if (title.length === 0 || description.length === 0) {
            setError(true);

            gsap.to(cardRef.current, {
                keyframes: [{ scale: 1.05 }, { scale: 1 }],
                duration: 0.3,
                ease: "power2.inOut",
            });

            return;
        }

        setError(false);

        // Add button animation
        gsap.to(addBtnRef.current, {
            scale: 1.1,
            duration: 0.2,
            onComplete: () => {
                gsap.to(addBtnRef.current, {
                    scale: 1,
                    duration: 0.2,
                });
            },
        });

        setAddNotesPressed(false);
        handleAdd();
    };

    return (
        <div
            ref={cardRef}
            className={`bg-secondary rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-[200px] relative ${
                error ? "border-t-4 border-red-500" : ""
            }`}
        >
            <div className="p-4 flex-grow overflow-hidden flex flex-col gap-2">
                <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="font-medium text-lg bg-transparent w-full outline-none text-primary placeholder:text-primary/50"
                    placeholder="Note Title"
                />
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-primary/70 text-sm h-full w-full bg-transparent resize-none outline-none"
                    placeholder="Note Description"
                ></textarea>
            </div>

            <div className="flex items-center justify-between p-3 pt-2 border-t border-primary/10 bg-secondary">
                <div className="flex items-center gap-1 text-xs text-primary/50">
                    {error && (
                        <span className="text-red-500">Fill all fields</span>
                    )}
                </div>

                <div className="flex items-center gap-1 mt-1">
                    <button
                        ref={addBtnRef}
                        onClick={handleAddNote}
                        className="bg-black text-white p-2 px-5 pr-7 rounded-md flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add Note</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNoteCard;
