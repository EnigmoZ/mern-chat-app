import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async(req, resp) =>{
    try {
        const {message}= req.body;
        const {id: recieverId } = req.params;
        const senderId = req.user._id;
        
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, recieverId]},
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, recieverId],
            })
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message,
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        
        //won't run in parallel
        // await conversation.save();
        // await newMessage.save();

        //this will run parallel
        await Promise.all([conversation.save(),newMessage.save()]);

        resp.status(201).json(newMessage);
    } catch(error) {
        console.log("Error in sendMessage Controller: ",error.message);
        resp.status(500).json({error:"Internal server error"});
    } 
};   

export const getMessages = async(req, resp) =>{
    try {
        const {id: usertochatid} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, usertochatid]},
        }).populate("messages");

        resp.status(200).json(conversation.messages); 
    } catch (error) {
        console.log("Error in getMessages Controller: ",error.message);
        resp.status(500).json({error:"Internal server error"});
    }
}