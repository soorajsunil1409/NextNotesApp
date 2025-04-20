"use client";

import React, { useRef, useState } from "react";
import {
    Bookmark,
    BookmarkCheck,
    Clock,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import { INote } from "@/models/Note";
import { useNoteCardAnimation } from "@/components/animations";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import gsap from "gsap";
import EditFields from "./EditFields";

interface NoteProps {
    note: INote;
    onDelete: (id: string) => void;
    editNotes: (note: INote) => void;
    viewMode?: "grid" | "list";
}

const Note = React.memo(
    ({ note, onDelete, editNotes, viewMode = "grid" }: NoteProps) => {
        const [isMarked, setIsMarked] = useState<boolean>(note.marked);

        const [currentNote, setCurrentNote] = useState<INote>(note);
        const [isUpdating, setIsUpdating] = useState<boolean>(false);
        const [isEditing, setIsEditing] = useState<boolean>(false);

        const [editedTitle, setEditedTitle] = useState<string>("");
        const [editedDesc, setEditedDesc] = useState<string>("");
        const [error, setError] = useState<boolean>(false);

        const cardRef = useNoteCardAnimation();
        const statusBtnRef = useRef<HTMLButtonElement>(null);

        const handleToggleMark = async () => {
            try {
                if (isUpdating) return;
                setIsMarked((prev) => !prev);

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
                    editNotes(newNote);
                } else {
                    toast.error(message);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsUpdating(false);
            }
        };

        const formattedDate = formatDistanceToNow(new Date(note.date_added), {
            addSuffix: true,
        });

        const handleEdit = () => {
            setIsEditing((prev) => !prev);

            setEditedTitle(currentNote.title);
            setEditedDesc(currentNote.description);
        };

        const handleEditClick = async () => {
            if (editedTitle.length === 0) {
                setError(true);
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

                setError(false);
            } catch (err: any) {
                toast.error(err);
            }
        };

        const handleDeleteClick = async () => {
            const confirmDelete = window.confirm(
                "Are you sure you want to delete this note?"
            );
            if (!confirmDelete) {
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

        if (viewMode === "list") {
            return (
                <div
                    ref={cardRef}
                    className={`bg-secondary rounded-lg p-4 overflow-hidden transition-all duration-200 flex gap-4 relative ${
                        isMarked ? "border-l-4 border-primary" : ""
                    } ${error ? "border-l-4 border-red-500" : ""}`}
                >
                    <div className="flex-grow">
                        {isEditing ? (
                            <div className="flex gap-5 items-center">
                                <EditFields
                                    editedDesc={editedDesc}
                                    editedTitle={editedTitle}
                                    setEditedDesc={setEditedDesc}
                                    setEditedTitle={setEditedTitle}
                                />
                                <button
                                    onClick={handleEditClick}
                                    className="bg-anti-contrast p-3 px-6 h-fit text-md rounded-lg text-white font-bold"
                                >
                                    Edit Note
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-medium text-primary truncate">
                                        {currentNote.title}
                                    </h3>
                                </div>
                                <p className="text-primary/70 line-clamp-1 mb-2">
                                    {currentNote.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-primary/50">
                                    <Clock className="w-3 h-3" />
                                    <span>{formattedDate}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggleMark}
                            className="p-2 text-primary/70 hover:text-primary transition-colors"
                        >
                            {isMarked ? (
                                <BookmarkCheck className="w-5 h-5" />
                            ) : (
                                <Bookmark className="w-5 h-5" />
                            )}
                        </button>
                        <button
                            onClick={handleEdit}
                            className="p-2 text-primary/70 hover:text-primary transition-colors"
                        >
                            <Pencil className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 text-primary/70 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div
                ref={cardRef}
                className={`bg-secondary rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-[200px] relative ${
                    isMarked ? "border-t-4 border-primary" : ""
                } ${error ? "border-t-4 border-red-500" : ""}`}
            >
                <div className="p-4 flex-grow overflow-hidden">
                    {isEditing ? (
                        <div className="flex flex-col gap-2 h-full">
                            <EditFields
                                editedDesc={editedDesc}
                                editedTitle={editedTitle}
                                setEditedDesc={setEditedDesc}
                                setEditedTitle={setEditedTitle}
                            />
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-medium text-primary mb-2 line-clamp-1">
                                {currentNote.title}
                            </h3>
                            <p className="text-primary/70 line-clamp-4 text-sm">
                                {currentNote.description}
                            </p>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between p-3 pt-2 border-t border-primary/10 bg-secondary">
                    <div className="flex items-center gap-1 text-xs text-primary/50">
                        {isEditing ? (
                            <button
                                onClick={handleEditClick}
                                className="bg-anti-contrast p-2 px-10 text-md rounded-lg text-white font-bold"
                            >
                                Edit Note
                            </button>
                        ) : (
                            <>
                                <Clock className="w-3 h-3" />
                                <span>{formattedDate}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleToggleMark}
                            className="p-1.5 text-primary/70 hover:text-primary transition-colors"
                        >
                            {isMarked ? (
                                <BookmarkCheck className="w-4 h-4" />
                            ) : (
                                <Bookmark className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            onClick={handleEdit}
                            className="p-1.5 text-primary/70 hover:text-primary transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="p-1.5 text-primary/70 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

export default Note;
