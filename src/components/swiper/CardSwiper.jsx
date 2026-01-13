/* eslint-disable react-hooks/immutability */
"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Mousewheel, FreeMode, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import EventCard from "../Events/EventCard";

function CardSwiper({ category, isSelected, onSelect, selectedEvents }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // 🔥 Attach navigation AFTER render
  useEffect(() => {
    if (!swiperInstance || !prevRef.current || !nextRef.current) return;

    swiperInstance.params.navigation.prevEl = prevRef.current;
    swiperInstance.params.navigation.nextEl = nextRef.current;

    swiperInstance.navigation.destroy();
    swiperInstance.navigation.init();
    swiperInstance.navigation.update();
  }, [swiperInstance]);

  return (
    <div className="w-full">

      {/* Top Navigation Arrows */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <button
          ref={prevRef}
          className="size-7 rounded-full border flex items-center justify-center hover:bg-gray-100 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          ref={nextRef}
          className="size-7 rounded-full border flex items-center justify-center hover:bg-gray-100 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <Swiper
        spaceBetween={6}
        freeMode={{ enabled: true, sticky: true }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        // pagination={{ clickable: true }}
        onSwiper={setSwiperInstance}
        breakpoints={{
          0: { slidesPerView: 1.5 },
          500: { slidesPerView: 1.5 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        modules={[Pagination, Mousewheel, FreeMode, Navigation]}
      >
        {category.events.map((event) => (
          <SwiperSlide key={event._id} className="mb-7 md:mb-10">
            <EventCard
              selectedEvents={selectedEvents.find(
                (item) => item.id === event._id
              )}
              event={event}
              isSelected={isSelected(event._id)}
              onSelect={onSelect}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CardSwiper;
