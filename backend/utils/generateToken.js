import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, resp)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    })
    resp.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000, //ms
        httpOnly: true, // prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", //prevents CSRF cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    });
};

export default generateTokenAndSetCookie;