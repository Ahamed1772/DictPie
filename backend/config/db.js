import mongoose from "mongoose";



const connectDb = async() => {
    try {
        const response = await mongoose.connect(process.env.MONGO_DB);
        console.log(`Successfully connected to the host: ${response.connection.host} on port ${response.connection.port}`)
    } catch (error) {
        console.log(`There is error ${error.message}`)
        process.exit(1);
    }
    
}


export default connectDb;