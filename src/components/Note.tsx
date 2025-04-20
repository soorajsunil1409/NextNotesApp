"use client";

import type { INote } from "@/models/Note";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNoteCardAnimation } from "./animations";
import gsap from "gsap";
import { Ellipsis, Trash2, StickyNote, X } from "lucide-react";

export const Note = React.memo(
    ({
        note,
        onDelete,
    }: {
        note: INote;
        onDelete: (notesId: string) => void;
    }) => {
        const [currentNote, setCurrentNote] = useState<INote>(note);
        const [isUpdating, setIsUpdating] = useState<boolean>(false);
        const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
        const [isEditing, setIsEditing] = useState<boolean>(false);

        const [editedTitle, setEditedTitle] = useState<string>("");
        const [editedDesc, setEditedDesc] = useState<string>("");

        const overlayRef = useRef<HTMLDivElement>(null);
        const overlayCardRef = useRef<HTMLDivElement>(null);
        const cardRef = useNoteCardAnimation();
        const statusBtnRef = useRef<HTMLButtonElement>(null);
        const menuRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    menuRef.current &&
                    !menuRef.current.contains(event.target as Node)
                ) {
                    setIsMenuOpen(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

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

        const handleEdit = () => {
            setIsMenuOpen(false);
            setIsEditing(true);

            setEditedTitle(note.title);
            setEditedDesc(note.description);
        };

        const handleCloseEdit = () => {
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => setIsEditing(false),
            });

            gsap.to(cardRef.current, {
                clearProps: "all",
                duration: 1,
                ease: "power3.inOut",
            });
        };

        const handleEditClick = async () => {
            if (editedTitle.length === 0) {
                gsap.to(overlayCardRef.current, {
                    keyframes: [
                        { scale: 1.03 },
                        { scale: 1 },
                        { scale: 1.03 },
                        { scale: 1 },
                    ],
                    duration: 0.1,
                });
                return;
            }

            try {
                const changes = {
                    title: editedTitle,
                    description: editedDesc,
                };

                const newNote = {
                    ...note,
                    ...changes,
                };

                const res = await fetch("/api/notes", {
                    method: "PUT",
                    body: JSON.stringify({
                        note_id: note.notes_id,
                        changes,
                    }),
                });

                const { message } = await res.json();

                if (res.ok) {
                    toast.success(message);
                    setIsEditing(false);
                    setCurrentNote(newNote);
                } else {
                    toast.error(message);
                }
            } catch (err: any) {
                toast.error(err);
            }
        };

        const handleDeleteClick = async () => {
            const confirmDelete = window.confirm(
                "Are you sure you want to delete this note?"
            );
            if (!confirmDelete) {
                setIsMenuOpen(false);
                return;
            }

            try {
                const res = await fetch("/api/notes", {
                    method: "DELETE",
                    body: JSON.stringify({
                        note_id: note.notes_id,
                    }),
                });

                const { message } = await res.json();

                if (res.ok) {
                    toast.success(message);
                    onDelete(note.notes_id);
                } else {
                    toast.error(message);
                }
            } catch (err: any) {
                toast.error(err);
            }
        };

        return (
            <div className="flex">
                <div
                    ref={cardRef}
                    className="relative flex flex-col bg-secondary p-6 rounded-lg shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] border-popover h-[250px] gap-3 overflow-hidden transition-all"
                >
                    <div className="flex flex-col gap-3 h-[90%] w-[300px]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-medium text-primary">
                                {currentNote.title}
                            </h2>
                            <button
                                className="h-full text-primary"
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                            >
                                <Ellipsis />
                            </button>
                        </div>
                        <p className="text-primary-foreground line-clamp-5">
                            {currentNote.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-primary">
                            {note.date_added}
                        </div>
                        <button
                            ref={statusBtnRef}
                            onClick={handleMarkedNote}
                            disabled={isUpdating}
                            className={`text-sm w-fit font-medium px-4 py-2 rounded-full transition-colors ${
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

                    {isMenuOpen && (
                        <div
                            ref={menuRef}
                            className="absolute overflow-hidden shadow-xl right-6 top-14 bg-white flex flex-col justify-start text-sm rounded-md"
                        >
                            <button
                                onClick={handleEdit}
                                className="flex gap-2 px-4 py-2 items-center h-full w-full hover:bg-gray-200"
                            >
                                <StickyNote />
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="w-fit flex px-4 py-2 gap-2 text-red-500 items-center hover:bg-gray-200"
                            >
                                <Trash2 />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
                {isEditing && (
                    <div
                        ref={overlayRef}
                        className="absolute size-full backdrop-blur-sm z-10 top-0 left-0 flex pt-32 justify-center"
                    >
                        <button
                            onClick={handleCloseEdit}
                            className="bg-black absolute top-8 right-8 p-3 rounded-full text-white font-bold"
                        >
                            <X />
                        </button>
                        <div
                            ref={overlayCardRef}
                            className="flex flex-col gap-3 z-50 w-[400px] h-fit bg-white p-5 rounded-lg"
                        >
                            <div className="flex items-center justify-between">
                                <input
                                    className="text-xl font-medium bg-white outline-0 border-2 rounded-md p-2 w-full text-black"
                                    value={editedTitle}
                                    onChange={(e) =>
                                        setEditedTitle(e.target.value)
                                    }
                                />
                            </div>
                            <textarea
                                className="line-clamp-5 text-black bg-white outline-0 border-2 rounded-md p-2 h-full"
                                value={editedDesc}
                                onChange={(e) => setEditedDesc(e.target.value)}
                            />
                            <button
                                onClick={handleEditClick}
                                className="bg-anti-contrast p-3 text-xl rounded-lg text-white font-bold"
                            >
                                Edit Note
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);
