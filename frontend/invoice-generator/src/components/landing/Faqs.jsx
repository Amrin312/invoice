import { useState } from 'react';
import { FAQS  } from '../../utils/data';
import FaqItem from './FaqItem';

const Faqs = () => {
    const [ openIndex, setOpenIndex ] = useState(null);

    const handleClick = (index) => {
        setOpenIndex( openIndex === index ? null : index);
    }

  return (
    <section id="faq" className='py-20 lg:py-28 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4'>Frequently Asked Questions</h1>
                <p className='text-xl text-gray-600 max-w-3xl mx-auto'>Everything you need to know about the product and billing</p>
            </div>

            <div className='space-y-4 '>
                {
                    FAQS.map((faq, index) => {
                        return (
                            <FaqItem key={index} faq={faq} isOpen={openIndex === index} onClick={() => handleClick(index)} />
                        )
                    })
                }
            </div>
        </div>
    </section>
  )
}

export default Faqs