import mongoose from 'mongoose'

export const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            console.log(err);
        } else {
            console.log("Something went wrong");
        }
    }
}