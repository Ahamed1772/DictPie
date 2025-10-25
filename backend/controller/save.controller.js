import Message from '../models/message.js'
import httpStatus from 'http-status-codes'


//create a data 
export const createMessage = async(req, res) => {
    try {
        
        //checking every field
        const {word, FetchMeaning, AiMeaning, audio, text,} = req.body;     
        //checking if word is already exist or not
        const user = req.user;
        const wordExistAlready = await Message.findOne({ word, userId: user._id });
        if (wordExistAlready){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Word already exist in your Gallery"
            })
        }
        //inserting data into the database
        const doct = { word: word, audio: audio, text: text, FetchMeaning: FetchMeaning, AiMeaning: AiMeaning}
        const response = await Message.create({
            word: word,
            meaning: doct,
            userId: user._id
        });

        //success
        return res.status(httpStatus.CREATED).json({
            success: true,
            message: "successfully saved the meaning to the dashboard",
            data: response
        })
    }   
    catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error in createMessage route in save controller",
            error: error.message
        })
    }

}

//getting the whole data
export const getMessage = async(req, res) => {
    try {
        const userId = req.userId;
        const response = await Message.find({ userId: userId });
        if (response === null){
            return res.status(httpStatus.OK).json({
                success: false,
                message: "There is no data.So nothing to fetch",
            });
        }
        return res.status(httpStatus.OK).json({
            success: true,
            message: "successfully fetched the data from database",
            data: response
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error in getMessage route in save controller",
            error: error.message
        })
    }
}

//updating the message 
export const patchMessage = async(req, res) => {
    try {
        const data = req.body;
        const userId = req.userId;
        const response = await Message.updateOne(
            {userId: userId},
            { $set: data },
            { new: true }
        );
        if (!response){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: "false",
                message: "There is error in updating the response"
            })
        };
        return res.status(httpStatus.OK).json({
            success: true,
            message: "successfully updated the data from database",
            data: response
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error in patchMessage route in save controller",
            error: error.message
        })
    }
}

//deleting the message
export const deleteMessage = async(req, res) => {
    try {
        const userId = req.userId;
        const {word} = req.body;
        console.log(word);
        if(!word){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: `unable to delete ${word}`
            })
        }

        const response = await Message.deleteOne({userId: userId, word: word});
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Successfully deleted the message"
        })
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error in deleteMessage route in save controller",
            error: error.message
        })
    }
}