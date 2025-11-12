'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
const slides = [
  {
    id: 1,
    title: 'Summer Sale Collection',
    description: 'Sale! Up to 500% off!',
    img: 'https://images.pexels.com/photos/19090/pexels-photo.jpg',
    url: '/',
    bg: 'bg-gradient-to-r from-yellow-50 to-pink-50',
  },
  {
    id: 2,
    title: 'Autumn Essentials',
    description: 'Cozy up with our latest arrivals 🍂',
    img: 'https://images.pexels.com/photos/32277798/pexels-photo-32277798/free-photo-of-man-in-stylish-coat-posing-in-forest-setting.jpeg',
    url: '/autumn',
    bg: 'bg-gradient-to-r from-yellow-50 to-pink-50',
  },
  {
    id: 3,
    title: 'Winter Warmers',
    description: 'Stay warm and stylish this winter ❄️',
    img: 'https://images.pexels.com/photos/179909/pexels-photo-179909.jpeg',
    url: '/winter',
    bg: 'bg-gradient-to-r from-yellow-50 to-pink-50',
  },
]

const Slider = () => {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(slideInterval)
  }, [])
  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide, id) => (
          <div className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`} key={id}>
            {/**TEXT CONTAINER */}
            <div className="text-black h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
              <h2 className="text-xl lg:text-3xl 2xl:text-5xl">{slide.description}</h2>
              <h1 className="text-5xl lg:text-6xl 2xl:text-8xl">{slide.title}</h1>
              <Link href={slide.url}>
                <button className="rounded-md bg-black text-white py-3 px-4">SHOP NOW</button>
              </Link>
            </div>
            {/**IMAGE CONTAINER */}
            <div className="h-1/2 xl:h-full xl:w-1/2 relative">
              <Image src={slide.img} alt="" fill sizes="100%" className="object-cover" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`w-3 h-3 rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center
      ${current === index ? 'scale-150' : ''}`}
            onClick={() => setCurrent(index)}
          >
            {current === index && <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Slider
