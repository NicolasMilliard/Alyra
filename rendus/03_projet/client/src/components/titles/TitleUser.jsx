import React from 'react';

const TitleUser = ({ isOwner, isVoter }) => {
  return (
    <div>
        {/* The title is personalized according to the role of the user */}
        { isOwner && <h2 className='mb-4'>You’re the administrator 🤘</h2> }
        { !isOwner && isVoter && <h2 className='mb-4'>You’re a voter 🥳</h2> }
        { !isOwner && !isVoter && <h2 className='mb-4'>You’re not a voter 😢</h2> }
    </div>
  )
}

export default TitleUser