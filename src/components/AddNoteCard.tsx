import { INote } from "@/models/Note";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

interface IAddNoteCard {
    setAddNotesPressed: (v0: boolean) => void;
    setNotes: (v0: INote[] | ((prev: INote[]) => INote[])) => void;
}

const AddNoteCard = ({ setAddNotesPressed, setNotes }: IAddNoteCard) => {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

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
            return;
        }

        setError(false);
        setAddNotesPressed(false);
        handleAdd();
    };

    return (
        <div
            className={`${
                error && "border-[1.5px] border-red-600"
            } bg-gray-300 flex flex-col gap-3 p-6 h-[300px] rounded-lg text-black shadow-sm hover:shadow-xl shadow-black transition-shadow duration-300 cursor-pointer`}
        >
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                className="outline-1 outline-double rounded-sm outline-black font-bold p-3 w-full"
                placeholder="Note Title"
            />
            <textarea
                name=""
                id=""
                onChange={(e) => setDescription(e.target.value)}
                className="border-[1px] outline-0 rounded-sm border-black h-full p-3"
                placeholder="Note Description"
            ></textarea>
            <button
                onClick={handleAddNote}
                className="p-3 bg-secondary text-white rounded-md hover:bg-secondary/95 outline-0"
            >
                Add Note
            </button>
        </div>
    );
};
export default AddNoteCard;
