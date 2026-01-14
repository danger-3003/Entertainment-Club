/* eslint-disable @next/next/no-img-element */
"use client"

import React from 'react'
import { ArrowRight } from 'lucide-react'

function Hero() {
  return (
    <>
      <div className="w-full">
        <div className="w-full flex items-center justify-center mt-40 mb-20">
          <div className="px-5 md:px-10 flex flex-col justify-center max-w-5xl">
            <div className="flex items-center justify-center flex-col">
              <img src="/logo.png" alt="Adventure Thrill City" className="h-56 mb-5" style={{ filter: "drop-shadow(0px 0px 5px rgba(0,0,0,0.3))" }} />
            </div>
            <p className="bg-linear-90 from-indigo-600 to-cyan-400 bg-clip-text text-transparent text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-center font-semibold py-5">
              Experience the Ultimate Adventure Playground.
            </p>
            <div className="flex items-center justify-center flex-row mt-5">
              <a
                href='#events'
                className="text-sm w-40 text-white py-2 rounded-full text-center cursor-pointer bg-indigo-600 font-semibold flex items-center justify-center gap-2"
              >
                Book Now
                <ArrowRight className='font-semibold' size={14} />
              </a>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <div className='max-w-5xl w-full px-5'>
            <div className='rounded-2xl overflow-hidden border-2 border-white shadow-lg'>
              <video
                className="w-full object-cover"
                src="https://www.vishwanadhsportsclub.in/assets/IntroVideo-qSO8-Zui.mp4"
                controls
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero