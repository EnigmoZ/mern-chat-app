import User from '../models/user.model.js'

export const getUsersForSidebar = async(req, resp)=>{
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")
        resp.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error in getUserForSidebar: ", error.message);
        resp.status(500).json({error:"internal server error"});
    }
}