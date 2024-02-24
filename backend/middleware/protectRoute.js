import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute= async(req, resp, next) => {
    try {
        const token = req.cookies.jwt;  
        if(!token){
                return resp.status(401).json({error: "Unauthorized - No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return resp.status(401).json({error: "Unauthorized - Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return resp.status(404).json({error: "User Not Found"});
        }

        req.user=user;
        next(); 
    } catch (error) {
        console.log("Error in protect route middleware: ", error.message)   
        resp.status(500).json({error: "Internal server error"});
    }
};

export default protectRoute;