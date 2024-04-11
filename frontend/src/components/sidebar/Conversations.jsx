import React from 'react'
import useGetConversations from '../../hooks/useGetConversations.js';
import { getRandomEmoji } from  '../../utils/emojis.js'
import Conversation from './Conversation.jsx'

const Conversations = () => {
  const {loading, conversations} = useGetConversations();
  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {conversations.map((conversation,idx) => (
        <Conversation
          key = {conversation._id}
          conversation={conversation}
          emoji = {getRandomEmoji()}
          lastIdx={idx === conversation.length - 1}
        />
      ))}
      
      {loading ? <span className = 'loading loading-spinner mx-auto'></span>:null}
    </div>
  )
}
export default Conversations


//STARTER CODE
// import React from 'react'
// import Conversation from './Conversation.jsx'

// const Conversations = () => {
//   return (
//     <div className='py-2 flex flex-col overflow-auto'>
//         <Conversation/>
//         <Conversation/>
//         <Conversation/>
//         <Conversation/>
//         <Conversation/>
//         <Conversation/>
//     </div>
//   )
// }

// export default Conversations