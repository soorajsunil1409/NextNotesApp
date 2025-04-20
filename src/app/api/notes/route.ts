import { connectMongo } from "@/lib/DB";
import { Note } from "@/models/Note";
import { requireAuth } from "@/utils/authSession";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        await connectMongo();

        const session = await requireAuth();
        const notes = await Note.find({ email: session.user?.email });
        
        return NextResponse.json({data: notes, message: "Notes fetched successfully"}, {status: 200})
    } catch (error) {
        return NextResponse.json({data: [], message: error}, {status: 500})
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectMongo();
        const session = await requireAuth();
        
        const {note_id, changes} = await request.json();

        await Note.findOneAndUpdate(
            { notes_id: note_id, email: session.user?.email },
            { $set: changes }
        );
    
        return NextResponse.json({message: "Note Changed successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error}, {status: 500})
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectMongo();
        await requireAuth();
        
        const {note_id} = await request.json();

        await Note.deleteOne({notes_id: note_id});
    
        return NextResponse.json({message: "Note Deleted successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error}, {status: 500})
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectMongo();
        await requireAuth();

        const newNote = await request.json();

        await Note.create(newNote);
    
        return NextResponse.json({data: newNote, message: "Note added successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({data: [], message: error}, {status: 500})
    }
}