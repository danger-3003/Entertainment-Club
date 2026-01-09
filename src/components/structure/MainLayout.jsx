"use client";

import React from "react";
import useEventCartStore from "@/store/useEventCartStore";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

function MainLayout({ children }) {
  const selectedStoreEvents = useEventCartStore(
    (state) => state.selectedEvents
  );

  const router = useRouter();

  //TOTAL COUNT (adult + kid)
  const totalCount = selectedStoreEvents.reduce((total, event) => {
    return total + (event.count.adult || 0) + (event.count.kid || 0);
  }, 0);

  return (
    <div className="w-full flex items-center justify-center">
      {/* Header */}
      <header className="fixed top-3 w-full z-10 bg-transparent flex items-center justify-center">
        <div className="w-full max-w-7xl bg-white/50 backdrop-blur-xl flex items-center justify-between py-4 px-4 sm:px-7 rounded-2xl">
          <h1 className="text-2xl font-semibold text-indigo-600 tracking-widest">
            Events
          </h1>

          <div className="flex items-center gap-3">
            <div className="text-sm cursor-pointer group text-center">
              My Orders
              <div className="w-0 group-hover:w-full bg-indigo-600 h-0.5 rounded-full duration-300"></div>
            </div>

            <div
              className="rounded-lg bg-white text-indigo-600 size-8 hover:shadow-md shadow-black/20 duration-300 relative flex items-center justify-center cursor-pointer"
              onClick={() => { totalCount > 0 && router.push("/cart") }}
            >
              {totalCount > 0 && (
                <div className="bg-indigo-600 text-white rounded-full size-5 absolute -top-2 -right-2 flex items-center justify-center">
                  <p className="text-xs">{totalCount}</p>
                </div>
              )}

              <ShoppingCart size={18} />
            </div>
          </div>
        </div>
      </header >

      <div className="w-full mt-20 flex items-center justify-center">
        {children}
      </div>
    </div >
  );
}

export default MainLayout;
