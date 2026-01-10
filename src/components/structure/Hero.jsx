/* eslint-disable @next/next/no-img-element */
import React from 'react'

function Hero() {
  return (
    <>
      <div className="w-full relative h-200">
        <video
          className="absolute w-full h-200 object-cover"
          src="https://www.vishwanadhsportsclub.in/assets/IntroVideo-qSO8-Zui.mp4"
          controls
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="bg-linear-to-b from-black/70 via-black/50 to-black/40 w-full h-200 absolute top-0"></div>
        <div className="w-full absolute top-20 left-0 flex items-center justify-center">
          <div className="px-5 md:px-10 h-160 flex flex-col justify-center">
            <div className="flex items-center justify-center flex-col">
              <img src="https://www.vishwanadhsportsclub.in/assets/logo-HJQU3g0R.png" alt="Vishwanadh Sports Club" className="h-16 md:h-20 mb-5" style={{ filter: "drop-shadow(0px 0px 5px rgba(0,0,0))" }} />
              <img src="https://www.vishwanadhsportsclub.in/assets/AdevturesName-CNJpe1Eo.svg" alt="Adventures and Thrills" className="w-56 md:w-80" style={{ filter: "drop-shadow(0px 0px 5px rgba(0,0,255,0.7))" }} />

            </div>
            <p className="text-white text-xl text-center">
              Your Ultimate Adventure and Sports Destination
            </p>
            <div className="flex items-center justify-center flex-row mt-5">
              <button
                className="text-sm w-40 bg-white py-2 rounded-full cursor-pointer text-indigo-600 font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero