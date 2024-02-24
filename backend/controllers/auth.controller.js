import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async(req,resp)=>{
    try {
        const {fullname,username,password,confirmPassword,gender}=req.body;
        if(password !== confirmPassword){
            return resp.status(400).json({error:"Password don't match"})
        }

        const user = await User.findOne({username});

        if(user){
            return resp.status(400).json({error:"username already exists"})
        }
        
        //hash password here
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);
        //https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            password:hashedpassword,
            gender,
            profilepic: gender === "male" ? boyProfilePic : girlProfilePic,
        })
        if(newUser){
            // generate jwt token here
            generateTokenAndSetCookie(newUser._id,resp);   
            await newUser.save();

            resp.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilepic,
            })
        }else{
            resp.status(400).json({error:"Invalid User Data"});
        }
        

    } catch (error) {
        console.log("error in signup controller",error.message)
        resp.status(500).json({error: "Internal Server Error"})        
    }
}

export const login = async (req,resp)=>{
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return resp.status(400).json({error: "Invalid Username Or Password"});
        }

        generateTokenAndSetCookie(user._id, resp);
        resp.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilepic,
        })
    } catch (error) {
        console.log("error in login controller",error.message)
        resp.status(500).json({error: "Internal Server Error"})        
    }
}

export const logout = (req,resp)=>{
    try {
        resp.cookie("jwt","",{maxAge: 0})
        resp.status(200).json({message:"Logged Out Successfully"})
    } catch (error) {
        console.log("error in logout controller",error.message)
        resp.status(500).json({error: "Internal Server Error"})        
    }
}