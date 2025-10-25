import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        trim: true
    },
    meaning: {
        type: Object,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
export default Message; 