"use client";

import React, { useEffect, useState } from "react";
import { getAllEvents } from "@/services/handlers";
import useEventCartStore from "@/store/useEventCartStore";
import CardSwiper from "@/components/swiper/CardSwiper";
import Hero from "@/components/structure/Hero";
import Gallery from "@/components/structure/Gallery";
import useBookingStatus from "@/store/useBookingStatus";
import Cookies from "js-cookie";
import useUserStore from "@/store/useUserStore";

function Page() {
  const {
    selectedEvents,
    setSelectedEvents
  } = useEventCartStore();

  const {
    booking,
    resetBooking
  } = useBookingStatus();

  const { resetUser } = useUserStore();

  const [categories, setCategories] = useState([]);
  const token = Cookies.get("token");

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

  useEffect(() => {
    if (!token) {
      resetUser()
    }
  }, [resetUser, token]);

  const addEvent = (event, type) => {
    setSelectedEvents((prev) => {
      const existingEvent = prev.find((e) => e.id === event._id);

      if (existingEvent) {
        return prev.map((e) =>
          e.id === event._id
            ? {
              ...e,
              count: {
                ...e.count,
                [type]: e.count[type] + 1,
              },
            }
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

  const handleClosePopUp = () => {
    resetBooking();
  }

  return (
    <>
      <div className="w-full flex flex-col items-center gap-10">
        <div className="w-full">
          <Hero />
        </div>
        <div id="events" className="max-w-5xl w-full flex flex-col gap-10 px-4 sm:px-7 my-5 sm:my-10">
          {categories.map((category) => (
            <section key={category.categoryCode}>
              <h2 className="flex items-center text-center w-full justify-center text-indigo-500 font-bold uppercase text-3xl md:text-4xl mb-5">{category.categoryName}</h2>
              <CardSwiper
                selectedEvents={selectedEvents}
                category={category}
                isSelected={isSelected}
                onSelect={addEvent}
              />
            </section>
          ))}
        </div>
        <div className="max-w-5xl w-full flex items-center justify-center flex-col px-5 gap-5 mb-10">
          <Gallery />
        </div>
      </div>
      {
        booking &&
        <div className="w-full h-screen bg-black/80 fixed top-0 z-10 flex items-center justify-center">
          <div className="bg-white rounded-xl md:rounded-2xl w-60 sm:w-80 h-40 p-5 shadow-2xl flex items-center justify-center flex-col gap-5">
            <p className="text-center">Booking successful! Your ticket has been sent to your email.</p>
            <button
              onClick={handleClosePopUp}
              className="text-sm w-32 bg-indigo-600 hover:bg-indigo-700 cursor-pointer
              hover:shadow-md duration-300 text-white py-1.5 rounded-full"
            >
              Okay
            </button>
          </div>
        </div>
      }
    </>
  );
}

export default Page;
