/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import useEventCartStore from "@/store/useEventCartStore";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

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
    <div className="w-full flex items-center justify-center flex-col">
      {/* Header */}
      <header className="fixed top-3 max-w-5xl w-full z-10 bg-transparent flex items-center justify-center px-4 sm:px-7">
        <div className="w-full bg-black/50 backdrop-blur-xl flex items-center justify-between py-1 px-4 sm:px-7 rounded-2xl">
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="w-12" />
          </Link>

          <div className="flex items-center gap-3">
            <div onClick={() => { router.push("/my-orders") }} className="text-sm cursor-pointer group text-center text-white">
              My Orders
              <div className="w-0 group-hover:w-full bg-indigo-600 h-0.5 rounded-full duration-300"></div>
            </div>

            <div
              className="rounded-lg text-white size-8 relative flex items-center justify-center cursor-pointer"
              onClick={() => { totalCount > 0 && router.push("/cart") }}
            >
              {totalCount > 0 && (
                <div className="bg-indigo-600 text-white rounded-full size-5 absolute -top-2 -right-2 flex items-center justify-center">
                  <p className="text-xs">{totalCount}</p>
                </div>
              )}

              <ShoppingCart size={18} className="text-white" />
            </div>
          </div>
        </div>
      </header>
      <div className="min-h-[calc(100vh-40px)] w-full flex justify-center">
        {children}
      </div>
      <footer className="bg-black py-4 px-5 w-full flex items-center justify-center text-white text-sm">
        <p>Made with ❤️ by Adventure Thrill City.</p>
      </footer>
    </div >
  );
}

export default MainLayout;
