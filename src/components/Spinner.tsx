import { Loader } from 'lucide-react'
import React from 'react'

const Spinner = () => {
  return (
    <div className='py-8'>
      <Loader className='animate-spin mx-auto' size={100} />

    </div>
  )
}

export default Spinner