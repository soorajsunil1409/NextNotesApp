"use client";

import type { INote } from "@/models/Note";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNoteCardAnimation } from "./animations";
import gsap from "gsap";

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

    // Animation for appearing
    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        );
    }, []);

    const handleAdd = async () => {
        try {
            const note = {
                notes_id: Date.now().toString(),
                title: title,
                email: session?.user?.email,
                description: description,
                marked: false,
            };

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

            setNotes((prev) => [data as INote, ...prev]);
        } catch (err: any) {
            console.log(err);
            toast.error(err);
        }
    };

    const handleAddNote = () => {
        if (title.length === 0 || description.length === 0) {
            setError(true);

            // Shake animation for error
            gsap.to(cardRef.current, {
                keyframes: [{ x: -5 }, { x: 5 }, { x: -5 }, { x: 5 }, { x: 0 }],
                duration: 0.4,
                ease: "power1.inOut",
            });

            return;
        }

        setError(false);

        // Success animation
        gsap.to(cardRef.current, {
            y: -20,
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            onComplete: () => {
                setAddNotesPressed(false);
                handleAdd();
            },
        });
    };

    return (
        <div
            ref={cardRef}
            className={`${
                error ? "border-2 border-red-300" : "border-gray-100"
            } bg-secondary flex flex-col gap-3 p-6 rounded-lg text-primary border-2 border-popover shadow-sm transition-all`}
        >
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium text-lg p-3 w-full bg-transparent border-2 border-muted rounded-lg focus:border-primary outline-none transition-colors"
                placeholder="Note Title"
            />
            <textarea
                onChange={(e) => setDescription(e.target.value)}
                className="h-full p-3 bg-transparent resize-none outline-none border-2 border-muted rounded-lg focus:border-primary"
                placeholder="Note Description"
            ></textarea>
            <button
                onClick={handleAddNote}
                className="p-3 bg-anti-contrast text-white rounded-md hover:bg-popover transition-colors"
            >
                Add Note
            </button>
        </div>
    );
};

export default AddNoteCard;
