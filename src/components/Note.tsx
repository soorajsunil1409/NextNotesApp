import { INote } from "@/models/Note";
import { useState } from "react";
import { toast } from "react-toastify";

export const Note = ({ note }: { note: INote }) => {
    const [currentNote, setCurrentNote] = useState<INote>(note);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

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
        <div className="relative bg-gray-300 p-6 h-[300px] rounded-lg shadow-sm hover:shadow-xl shadow-black transition-shadow duration-300 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-[#000b34]">
                {currentNote.title}
            </h2>
            <p className="text-gray-600">{currentNote.description}</p>
            <button
                onClick={handleMarkedNote}
                disabled={isUpdating}
                className={`absolute right-0 bottom-0 font-bold text-[#505050] ${
                    currentNote.marked ? "bg-green-400" : "bg-[#ffe013]"
                } p-2 px-8 rounded-tl-lg rounded-br-lg`}
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
