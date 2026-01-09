import React, { useRef, useState } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import EventCard from '../Events/EventCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination, Mousewheel, FreeMode } from 'swiper/modules';

function CardSwiper({ category, isSelected, onSelect, selectedEvents }) {
  return (
    <>
      <Swiper
        spaceBetween={6}
        direction='horizontal'
        freeMode={{
          enabled: true,
          momentum: true,
          momentumRatio: 0.8,
          momentumVelocityRatio: 0.7,
          sticky: true
        }}
        mousewheel={{
          forceToAxis: true,
          // sensitivity: 0.5,
          releaseOnEdges: true
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.5,
          },
          500: {
            slidesPerView: 1.5,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        modules={[Pagination, Mousewheel, FreeMode]}
        className="mySwiper"
      >
        {category.events.map((event) => (
          <SwiperSlide
            key={event._id}
            className='mb-7 md:mb-10'
          >
            <EventCard
              selectedEvents={selectedEvents.find((item) => item.id === event._id)}
              event={event}
              isSelected={isSelected(event._id)}
              onSelect={onSelect}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}


export default CardSwiper;