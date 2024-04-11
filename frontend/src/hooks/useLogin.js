import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext()

const login = async (username, password) => {
    toast.success(username)
    toast.success(password)
    const success = handleInputErrors(username, password);
    if (!success) return;
    setLoading(true)
    try {
        const resp = await fetch("/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password }),
        })
        if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        const data = await resp.json();
        if(data.error){
            throw new Error(data.error);
        }
        localStorage.setItem("chat-user", JSON.stringify(data));
        setAuthUser(data);
    } catch (error) {
        toast.error(error.message)
    } finally {
        setLoading(false)
    }
  };
  return {loading, login};
};

export default useLogin

function handleInputErrors(username, password){
    if(!username || !password){
        toast.error('Please fill in all fields')
        return false
    }
    return true
}

// import { useState } from 'react'
// import { useAuthContext } from '../context/AuthContext.jsx'
// import toast from 'react-hot-toast'

// const useLogin = () => {
//   const [loading, setLoading] = useState(false);
//   const {setAuthUser} = useAuthContext()

//   const login = async(username, password) => {
//     toast.success(username)
//     toast.success(password)
//     const success = handleInputErrors(username, password);
//     if(!success) return;
//     setLoading(true)
//     try {
//         const resp = await fetch(" /api/auth/login ",{
//             method: "POST",
//             headers: {"Context-Type": "application/json"},
//             body: JSON.stringify({ username, password }),
//         })
//         const data = await resp.json();
//         if(data.error){
//             throw new Error(data.error);
//         }
//         localStorage.setItem("chat-user",JSON.stringify(data));
//         setAuthUser(data);
//     } catch (error) {
//         toast.error(error.message)
//     }finally{
//         setLoading(false)
//     }
//   };
//   return {loading, login};
// };

// export default useLogin

// function handleInputErrors(username, password){
//     if(!username || !password){
//         toast.error('Please fill in all fields')
//         return false
//     }
//     return true
// }