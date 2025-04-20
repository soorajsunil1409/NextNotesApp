import { connectMongo } from "./DB";
import { Note } from "@/models/Note";

export const getUserNotes = async (userEmail: string) => {
    await connectMongo();

    const notes = await Note.find({email: userEmail});

    return notes;
}