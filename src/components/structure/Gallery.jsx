/* eslint-disable @next/next/no-img-element */
import React from "react";

function Gallery() {
  return (
    <>
      <div className="w-full flex items-center justify-center flex-col">
        <div className="text-center font-bold text-3xl md:text-4xl">
          <p className="uppercase text-orange-400">Stay & Play</p>
          <p className="uppercase text-violet-800">
            The Adventure Thrill&nbsp;City
          </p>
        </div>
        <div className="mt-10 w-full">
          <div className="relative w-full pb-[56.25%] overflow-hidden rounded-xl md:rounded-2xl shadow-customShadow">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl md:rounded-2xl"
              src="https://www.youtube.com/embed/imJXe-IId6Q?autoplay=0&mute=0&loop=1&playlist=imJXe-IId6Q"
              title="Vishwanadh Sports Club"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center flex-col gap-2 md:gap-4 w-full">
        <div className="flex items-center justify-center flex-row gap-2 md:gap-4 w-full">
          <div className="flex items-center justify-center flex-col gap-2 md:gap-4 w-full sm:w-56 md:w-[16rem] lg:w-52 xl:w-60">
            <img src="https://www.vishwanadhsportsclub.in/assets/Image1-oWXPEcJ4.jpg" alt="Gallery Image" className="rounded-xl h-61 w-full lg:w-52 xl:h-61 xl:w-60 object-cover" />
            <img src="https://www.vishwanadhsportsclub.in/assets/Image2-97b5uAf4.jpg" alt="Gallery Image" className="rounded-xl h-35 w-full lg:w-52 xl:h-35 xl:w-60 object-cover" />
          </div>
          <div className="hidden lg:flex items-center justify-center flex-col gap-2 md:gap-4">
            <div>
              <img src="https://www.vishwanadhsportsclub.in/assets/Image3-CHiuyEKL.jpg" alt="Gallery Image" className="rounded-xl h-48 w-132 xl:h-48 xl:w-132 object-cover" />
            </div>
            <div className="flex items-center justify-center flex-row gap-2 md:gap-4 w-132">
              <img src="https://www.vishwanadhsportsclub.in/assets/Image4-aaeR9__A.jpg" alt="Gallery Image" className={`rounded-xl h-48 w-[16rem] xl:h-48 xl:w-[16rem] object-cover`} />
              <img src="https://www.vishwanadhsportsclub.in/assets/Image5-CcveEnxE.jpg" alt="Gallery Image" className={`rounded-xl h-48 w-[16rem] xl:h-48 xl:w-[16rem] object-cover`} />
            </div>
          </div>
          <div className="flex items-center justify-center flex-col gap-2 md:gap-4 w-full sm:w-56 md:w-[16rem] lg:w-52 xl:w-60">
            <img src="https://www.vishwanadhsportsclub.in/assets/Image6-CsSCACC4.jpg" alt="Gallery Image" className="rounded-xl h-35 w-full lg:w-52 xl:h-35 xl:w-60 object-cover" />
            <img src="https://www.vishwanadhsportsclub.in/assets/Image7-BT0SYust.jpg" alt="Gallery Image" className="rounded-xl h-61 w-full lg:w-52 xl:h-61 xl:w-60 object-cover" />
          </div>
        </div>
        <div className="w-full sm:w-md flex items-center justify-center">
          <div className="flex lg:hidden items-center justify-center flex-col gap-2 md:gap-4 w-full md:w-132">
            <div className="w-full">
              <img src="https://www.vishwanadhsportsclub.in/assets/Image3-CHiuyEKL.jpg" alt="Gallery Image" className="rounded-xl h-48 w-full md:w-132 xl:h-48 xl:w-132 object-cover" />
            </div>
            <div className="flex items-center justify-center flex-row gap-2 md:gap-4 w-full md:w-132">
              <img src="https://www.vishwanadhsportsclub.in/assets/Image4-aaeR9__A.jpg" alt="Gallery Image" className={`rounded-xl h-48 w-[49%] md:w-[16rem] xl:h-48 xl:w-[16rem] object-cover`} />
              <img src="https://www.vishwanadhsportsclub.in/assets/Image5-CcveEnxE.jpg" alt="Gallery Image" className={`rounded-xl h-48 w-[49%] md:w-[16rem] xl:h-48 xl:w-[16rem] object-cover`} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gallery;
