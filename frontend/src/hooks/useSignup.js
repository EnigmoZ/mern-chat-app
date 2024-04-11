import React from 'react'
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';

const useSignup = () => {
  const [loading,setLoading] = useState(false);
  const {setAuthUser}=useAuthContext()

  const signup = async({fullname, username, password, confirmPassword, gender})=>{
    const success = handleInputErrors({fullname, username, password, confirmPassword, gender})
    if(!success) return;
    try {
        const resp = await fetch("/api/auth/signup",{
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({fullname, username, password, confirmPassword, gender}),
        })
        const data = await resp.json()
        console.log(data)
        if(data.error){
            throw new Error(data.error)
        }
        localStorage.setItem("chat-user", JSON.stringify(data));
        setAuthUser(data);
    } catch (error) {
        toast.error(error.message)
    }finally{
        setLoading(false);
    }
  };
  return{loading,signup}
};

export default useSignup

function handleInputErrors({fullname, username, password, confirmPassword, gender}){
    if(!fullname || !username || !password || !confirmPassword || !gender){
        toast.error('Please fill in all fields')
        return false
    }

    if(password !== confirmPassword){
        toast.error('Passwords do not match')
        return false
    }

    if(password.length < 6){
        toast.error('Password must be at least 6 characters')
        return false
    }
    return true
}