/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Plus, Check } from "lucide-react";

function EventCard({ event, isSelected, onSelect, selectedEvents }) {

  console.log(selectedEvents);

  return (
    <div
      className={`p-2 group flex flex-col gap-3 cursor-pointer`}
    >
      <img
        src={event.eventImage}
        alt={event.eventName}
        className={`rounded-md md:rounded-lg group-hover:shadow-black/20 group-hover:shadow-md transition-all duration-300 aspect-4/3 ${isSelected && "shadow-black/20 shadow-md"}`}
      />

      <div className="flex items-start justify-center flex-col">
        <div className="flex items-center justify-between flex-row w-full mb-4">
          <p className="text-sm sm:text-base font-medium">{event.eventName}</p>
        </div>
        <div className="w-full flex flex-col gap-3">
          {["adult", "kid"].map((type) => {
            const count = selectedEvents?.count?.[type] ?? 0;
            if (type === "kid" && event?._id === "695e38d721458b2d10464404") return null
            return (
              <div key={type} className="flex gap-5 items-center justify-between w-full" >
                <p className="uppercase font-medium text-gray-600 text-sm">{type}/s:( <span className="font-sans">₹</span>{event.pricing[type].sellingPrice}) </p>
                <div
                  onClick={() => onSelect(event, type)}
                  className={`flex items-center justify-between flex-row gap-2 text-xs sm:text- rounded-full border ${type === "adult" ? "border-indigo-600 text-indigo-600 bg-indigo-100" : "border-orange-600 text-orange-600 bg-orange-100"} px-2 py-0.5`}
                >
                  {
                    count > 0 ?
                      <>
                        Added <Check size={14} />
                      </> :
                      <>
                        Cart <Plus size={14} />
                      </>
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div >
  );
}

export default EventCard;
