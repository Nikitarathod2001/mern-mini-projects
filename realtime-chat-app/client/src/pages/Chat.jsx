import React from 'react'

const Chat = () => {
  return (
    <div className='h-screen flex bg-gray-100'>

      {/* --- Sidebar --- */}
      <aside className='w-80 bg-white border-r'>

        <div className='p-4 border-b'>

          <h1 className='text-xl font-bold'>
            Chats
          </h1>

        </div>

        <div className='p-4'>

          <p className='font-medium'>
            No conversations yet
          </p>

        </div>

      </aside>

      {/* --- Chat Area --- */}
      <main className='flex-1 flex items-center justify-center'>

        <h2 className='text-2xl font-semibold text-gray-500'>
          Select a conversation
        </h2>

      </main>
      
    </div>
  )
}

export default Chat
