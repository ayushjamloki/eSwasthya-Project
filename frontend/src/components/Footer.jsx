import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.main_logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>eSwasthya is a doctor appointment booking web service that helps you connect with top doctors without the hassle of long queues. Book appointments instantly and skip the wait at clinics. Fast, simple, and reliable healthcare access—right when you need it.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+917541236950</li>
            <li>eSwasthya@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024 @ eSwasthya.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
