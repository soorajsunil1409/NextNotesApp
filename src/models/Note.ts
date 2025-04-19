import mongoose, { models, Schema } from "mongoose";

export interface INote extends Document {
    notes_id: string,
    email: string,
    title: string,
    description: string,
    marked: boolean
}

const NoteSchema = new Schema({
    notes_id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    marked: {
        type: Boolean,
        required: false,
        default: false
    }
});

export const Note = models.Note || mongoose.model("Note", NoteSchema, "notes");