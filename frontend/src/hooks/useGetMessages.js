// import React, { useState, useEffect } from 'react';
// import useConversation from '../zustand/useConversation';
// import toast from 'react-hot-toast';

// const useGetMessages = () => {
//   const [loading, setLoading] = useState(false);
//   const { messages, setMessages, selectedConversation } = useConversation();

//   useEffect(() => {
//     const getMessages = async () => {
//       setLoading(true);
//       try {
//         if (!selectedConversation || !selectedConversation._id) {
//           throw new Error('No conversation selected');
//         }
//         const resp = await fetch(`/api/messages/${selectedConversation._id}`,{
//           method: "GET",
                 
//       });
//         if (!resp.ok) {
//           // Handle 404 error
//           if (resp.status === 404) {
//             throw new Error('No messages found for the selected conversation');
//           }
//           // Log other error status codes
//           console.error('Failed to fetch messages. Status code:', resp.status);
//           throw new Error('Failed to fetch messages');
//         }
//         const data = await resp.json();
//         setMessages(data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//         toast.error(error.message); // Display error message to user
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (selectedConversation) {
//       getMessages();
//     }
//   }, [selectedConversation, setMessages]);

//   return { messages, loading };
// };

// export default useGetMessages;





import {useState, useEffect} from 'react'
import useConversation from '../zustand/useConversation'
import toast from 'react-hot-toast'

const useGetMessages = () => {
  const [loading, setLoading] = useState(false)
  const {messages, setMessages, selectedConversation} = useConversation()
  
  useEffect(() => {
    const getMessages = async () => {
        setLoading(true);
        try{
            const resp = await fetch(`/api/messages/${selectedConversation._id}`)
            const data = await resp.json();
            if(data.error) throw new Error(data.error);
            setMessages(data);
        } catch(error){
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    };

    if(selectedConversation?._id) getMessages()
  },[selectedConversation?._id, setMessages])

  return {messages, loading}
}

export default useGetMessages