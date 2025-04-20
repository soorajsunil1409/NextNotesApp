import mongoose, { models, Schema } from "mongoose";

export interface INote {
    notes_id: string,
    email: string,
    title: string,
    description: string,
    date_added: string,
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
    date_added: {
        type: String,
        required: true
    },
    marked: {
        type: Boolean,
        required: false,
        default: false
    }
});

export const Note = models.Note || mongoose.model("Note", NoteSchema, "notes");