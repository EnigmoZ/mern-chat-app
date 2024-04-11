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
            password: hashedpassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        })
        if(newUser){
            // generate jwt token here
            generateTokenAndSetCookie(newUser._id, resp);   
            await newUser.save();

            resp.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilePic,
            })
        }else{
            resp.status(400).json({error:"Invalid User Data"});
        }
        

    } catch (error) {
        console.log("error in signup controller",error.message)
        resp.status(500).json({error: "Internal Server Error"})        
    }
}

export const login = async (req, resp) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return resp.status(400).json({ error: "Invalid Username" });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return resp.status(400).json({ error: "Invalid Password" });
        }

        // Generate JWT token and set cookie
        generateTokenAndSetCookie(user._id, resp);

        // Send response
        resp.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            gender: user.gender,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller:", error.message);
        resp.status(500).json({ error: "Internal Server Error" });
    }
}

// export const login = async(req , resp) => {
//     try {
//         const {username, password}= req.body;
                
//         console.log("username: ",username);
//         console.log("password: ",password);
//         const user = await User.findOne({username});
//         if (!user) {
//             return resp.status(400).json({ error: "Invalid Username" });
//         }

//         // const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return resp.status(400).json({ error: "Invalid  Password" });
//         }
//         generateTokenAndSetCookie(user._id, resp);
        
//         console.log(isPasswordCorrect);
//         resp.status(200).json({
//             _id: user._id,
//             fullname: user.fullname,
//             username: user.username,
//             gender: user.gender,
//             profilePic: user.profilePic,
//         });
//     } catch (error) {
//         console.log("error in login controller",error.message)
//         resp.status(500).json({error: "Internal Server Error"})        
//     }
// }

export const logout = (req,resp)=>{
    try {
        resp.cookie("jwt","",{maxAge: 0})
        resp.status(200).json({message:"Logged Out Successfully"})
    } catch (error) {
        console.log("error in logout controller",error.message)
        resp.status(500).json({error: "Internal Server Error"})        
    }
}