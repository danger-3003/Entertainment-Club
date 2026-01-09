/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import useEventCartStore from "@/store/useEventCartStore";

function CartSummary() {
  const cartData = useEventCartStore((state) => state.selectedEvents);
  const setSelectedEvents = useEventCartStore(
    (state) => state.setSelectedEvents
  );

  const COUPON_MIN_AMOUNT = 2999;
  const COUPON_DISCOUNT_PERCENT = 30;

  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const handleIncreaseCount = (id, type) => {
    setSelectedEvents((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            count: {
              ...item.count,
              [type]: item.count[type] + 1,
            },
          }
          : item
      )
    );
  };

  const handleDecreaseCount = (id, type) => {
    setSelectedEvents((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
              ...item,
              count: {
                ...item.count,
                [type]: Math.max(0, item.count[type] - 1),
              },
            }
            : item
        )
        .filter(
          (item) => item.count.adult > 0 || item.count.kid > 0
        )
    );
  };

  const subTotal = cartData.reduce(
    (sum, item) =>
      sum +
      item.pricing.adult * item.count.adult +
      item.pricing.kid * item.count.kid,
    0
  );

  const totalCount = cartData.reduce(
    (acc, item) => {
      acc.adult += item.count.adult;
      acc.kid += item.count.kid;
      return acc;
    },
    { adult: 0, kid: 0 }
  );

  const gst = subTotal * 0.18;
  const discount = isCouponApplied && subTotal >= COUPON_MIN_AMOUNT ? subTotal * (COUPON_DISCOUNT_PERCENT / 100) : 0;
  const total = subTotal + gst - discount;

  return (
    <div className="max-w-7xl w-full flex flex-col gap-4 px-4 sm:px-7">
      <div className="h-32 p-2 px-5 w-full bg-gray-100 rounded-xl shadow-sm flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold uppercase">
            Cart
          </h2>
          <p className="text-sm">Enjoy 30% instant discount on your total bill when you spend ₹2,999 or more.</p>
        </div>
        <img src="/CartHeader.svg" alt="CartHeader" className="w-32" />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* TABLE */}
        <div className="overflow-hidden rounded-xl shadow-sm w-full h-min">
          <div className="overflow-x-auto">
            <table className="w-full bg-white border-collapse">
              <thead className="bg-gray-100 text-gray-600">
                <tr className="text-sm">
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-center font-medium">Count</th>
                  <th className="px-6 py-3 text-center font-medium">Amount</th>
                </tr>
              </thead>

              {cartData.length > 0 ?
                <tbody>
                  {cartData.map((item) => {
                    const itemTotal =
                      item.pricing.adult * item.count.adult +
                      item.pricing.kid * item.count.kid;

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-gray-200 text-sm hover:bg-gray-50"
                      >
                        <td className="px-6 py-3 font-medium">
                          {item.name}
                        </td>

                        <td className="px-6 py-3 w-32">
                          <div className="flex flex-col gap-2">
                            {["adult", "kid"].map((type) => (
                              <div
                                key={type}
                                className="flex justify-between items-center gap-5"
                              >
                                <span className="uppercase text-xs text-gray-600">
                                  {type}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    className="size-6 bg-indigo-600 text-white rounded-full disabled:opacity-50"
                                    disabled={item.count[type] === 0}
                                    onClick={() =>
                                      handleDecreaseCount(item.id, type)
                                    }
                                  >
                                    -
                                  </button>

                                  <span className="w-4 text-center">
                                    {item.count[type]}
                                  </span>

                                  <button
                                    className="size-6 bg-indigo-600 text-white rounded-full"
                                    onClick={() =>
                                      handleIncreaseCount(item.id, type)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-3 text-center font-semibold text-indigo-600">
                          ₹{itemTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody> :
                <tbody>
                  <tr><td colSpan={3} className="text-center py-3 text-sm">No Items to show</td></tr>
                </tbody>
              }
            </table>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="sticky top-20 md:max-w-sm w-full flex flex-col gap-5">
          <div>
            <p className="font-medium text-gray-600 uppercase text-sm pb-3">Coupons & Offers</p>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              {subTotal >= COUPON_MIN_AMOUNT ?
                <>
                  <div className="bg-linear-to-br from-indigo-500 to-indigo-800 w-full rounded-lg text-white p-2 flex flex-row items-center justify-between gap-0.5">
                    <div>
                      <img src="/coupon.svg" alt="Coupon Image" className="h-full w-8" />
                    </div>
                    <div className="flex items-end justify-between gap-2 flex-col">
                      <p className="text-sm text-right font-medium">Get 30% OFF on orders above ₹2,999</p>
                      <button
                        onClick={() => { setIsCouponApplied(!isCouponApplied) }}
                        className="cursor-pointer text-[10px] sm:text-xs font-medium rounded-full px-3 sm:px-5 py-0.5 sm:py-1 border border-white bg-white/30 hover:shadow-sm duration-300"
                      >
                        {isCouponApplied ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                </> :
                <>
                  <p className="text-center text-sm">No coupons are available</p>
                </>
              }
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-600 uppercase text-sm pb-3">Payment Summary</p>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td>Total Count</td>
                    <td className="text-right py-1">
                      {totalCount.adult} (A), {totalCount.kid} (K)
                    </td>
                  </tr>
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-right py-1">₹{subTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>GST (18%)</td>
                    <td className="text-right py-1 text-green-600">
                      +₹{gst.toFixed(2)}
                    </td>
                  </tr>
                  {
                    isCouponApplied &&
                    <tr>
                      <td>Discount ({COUPON_DISCOUNT_PERCENT}%)</td>
                      <td className="text-right py-1 text-red-500">
                        -₹{discount.toFixed(2)}
                      </td>
                    </tr>
                  }
                  <tr className="font-semibold">
                    <td>Total Payable</td>
                    <td className="text-right py-1 text-indigo-600">
                      ₹{total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <button className="mt-4 text-sm w-full bg-indigo-600 hover:bg-indigo-700 hover:shadow-md duration-300 text-white py-2 rounded-full cursor-pointer">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
