"use client";

import React, { useEffect, useState } from "react";
import { getAllEvents } from "@/services/handlers";
import useEventCartStore from "@/store/useEventCartStore";
import CardSwiper from "@/components/swiper/CardSwiper";
import Hero from "@/components/structure/Hero";
import Gallery from "@/components/structure/Gallery";

function Page() {
  const {
    selectedEvents,
    setSelectedEvents
  } = useEventCartStore();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  const toggleSelectEvent = (event, type) => {
    setSelectedEvents((prev) => {
      const existingEvent = prev.find((e) => e.id === event._id);

      // If event already exists in cart
      if (existingEvent) {
        const updatedCount = {
          ...existingEvent.count,
          [type]: existingEvent.count[type] > 0 ? 0 : 1,
        };

        if (updatedCount.adult === 0 && updatedCount.kid === 0) {
          return prev.filter((e) => e.id !== event._id);
        }

        return prev.map((e) =>
          e.id === event._id
            ? { ...e, count: updatedCount }
            : e
        );
      }

      return [
        ...prev,
        {
          id: event._id,
          name: event.eventName,
          pricing: {
            adult: event.pricing.adult.sellingPrice,
            kid: event.pricing.kid.sellingPrice,
          },
          count: {
            adult: type === "adult" ? 1 : 0,
            kid: type === "kid" ? 1 : 0,
          },
        },
      ];
    });
  };

  const isSelected = (id) =>
    selectedEvents.some((e) => e.id === id);

  return (
    <>
      <div className="w-screen flex flex-col items-center gap-10">
        <div className="w-full">
          <Hero />
        </div>
        <div className="max-w-5xl w-full flex flex-col gap-10 px-5 my-5 sm:my-10">
          {categories.map((category) => (
            <section key={category.categoryCode}>
              <h2 className="flex items-center text-center w-full justify-center text-indigo-500 font-bold uppercase text-3xl md:text-4xl mb-5">{category.categoryName}</h2>
              <CardSwiper
                selectedEvents={selectedEvents}
                category={category}
                isSelected={isSelected}
                onSelect={toggleSelectEvent}
              />
            </section>
          ))}
        </div>
        <div className="max-w-5xl w-full flex items-center justify-center flex-col px-5 gap-5 mb-10">
          <Gallery />
        </div>
      </div>
    </>
  );
}

export default Page;
