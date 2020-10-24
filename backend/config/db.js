import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true
        });
        console.log(`MongoDB connected ${mongoose.connection.host}`.yellow.bold);
    } catch (error) {
        console.log(`Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
}

export default connectDB;