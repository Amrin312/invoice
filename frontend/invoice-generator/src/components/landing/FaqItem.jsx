import { ChevronDown } from 'lucide-react'
import React from 'react'

const FaqItem = ({faq, isOpen, onClick}) => {
  return (
    <div className='border border-gray-200 rounded rounded-xl overflow-hidden '>
        <button onClick={onClick}  className='w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200'>
            <span className='text-lg font-medium text-gray-900 pr-4 text-left'>{ faq.question }</span>
            <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        {
            isOpen && (
                <div className='p-6 text-gray-600 leading-relaxed border-t border-gray-100'>
                    { faq.answer }
                </div>
            )
        }
    </div>
  )
}

export default FaqItem