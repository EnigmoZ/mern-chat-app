import React, { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import MessageSkeleton from "../skeleton/MessageSkeleton.jsx";
import useGetMessages from "../../hooks/useGetMessages.js";
import useListenMessages from "../../hooks/useListenMessages.js";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({behaviour:"smooth"});
    },100)
  },[messages])

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div  key={message._id}
            ref = {lastMessageRef}
          >
            <Message message={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center">
          Send the message to Start the Conversation
        </p>
      )}
    </div>
  );
};

export default Messages;
