/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRazorpay } from "react-razorpay";
import { sendOtp, verifyOtpApi, createOrderApi } from "@/services/handlers";
import useEventCartStore from "@/store/useEventCartStore";

const RAZORPAY_PUBLIC_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_PUBLIC_KEY_ID;
export default function PaymentPage() {
  const {
    selectedEvents,
    isCouponApplied
  } = useEventCartStore();

  const COUPON_MIN_AMOUNT = 2999;
  const COUPON_DISCOUNT_PERCENT = 30;

  const router = useRouter();
  const { Razorpay } = useRazorpay();

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    contact: "",
    name: "",
    email: "",
    address: "",
  });

  const subTotal = selectedEvents.reduce(
    (sum, item) =>
      sum +
      item.pricing.adult * item.count.adult +
      item.pricing.kid * item.count.kid,
    0
  );

  const totalCount = selectedEvents.reduce(
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

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (formData.contact.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoadingOtp(true);
      setError("");

      const data = await sendOtp(formData.contact);
      setOtpSent(true);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoadingOtp(true);
      setError("");

      await verifyOtpApi({
        phone: formData.contact,
        otp,
      });

      setOtpVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoadingOtp(false);
    }
  };

  /* ---------------- PAYMENT ---------------- */
  const handlePayment = async () => {
    try {
      setLoadingPay(true);

      const amount = 200;

      const order = await createOrderApi({
        amount,
        currency: "INR",
      });

      const options = {
        key: RAZORPAY_PUBLIC_KEY_ID,
        amount,
        currency: "INR",
        name: "Booking",
        description: "Event Booking Payment",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        handler: function (response) {
          alert("Payment Successful!");
          router.push("/");
        },
        theme: { color: "#4f46e5" },
      };

      new Razorpay(options).open();
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoadingPay(false);
    }
  };


  return (
    <>
      <div className="max-w-7xl w-full flex flex-col gap-4 px-4 sm:px-7">
        <div className="h-32 p-2 px-5 w-full bg-gray-100 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold uppercase">
              Checkout
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

                {selectedEvents.length > 0 ?
                  <tbody>
                    {selectedEvents.map((item) => {
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
                              {["adult", "kid"].map((type) => {
                                if (type === "kid" && item?.id === "695e38d721458b2d10464404") return null
                                return (
                                  <div
                                    key={type}
                                    className="flex justify-between items-center gap-5"
                                  >
                                    <span className="uppercase text-xs text-gray-600">
                                      {type}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <span className="w-4 text-center">
                                        {item.count[type]}
                                      </span>
                                    </div>
                                  </div>
                                )
                              })}
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
                {(subTotal >= COUPON_MIN_AMOUNT && isCouponApplied !== false) ?
                  <>
                    <div className="bg-linear-to-br from-indigo-500 to-indigo-800 w-full rounded-lg text-white p-2 flex flex-row items-center justify-between gap-0.5">
                      <div>
                        <img src="/coupon.svg" alt="Coupon Image" className="h-full w-8" />
                      </div>
                      <div className="flex items-end justify-between gap-2 flex-col">
                        <p className="text-sm text-right font-medium">Get 30% OFF on orders above ₹2,999</p>
                        <div
                          className="text-[10px] sm:text-xs font-medium rounded-full px-3 sm:px-5 py-0.5 sm:py-1 border border-white bg-white/30 hover:shadow-sm duration-300"
                        >
                          {isCouponApplied !== false ? "Applied" : "Apply"}
                        </div>
                      </div>
                    </div>
                  </> :
                  <>
                    <p className="text-center text-sm">No coupons are applied.</p>
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
                    {
                      isCouponApplied &&
                      <tr>
                        <td>Discount ({COUPON_DISCOUNT_PERCENT}%)</td>
                        <td className="text-right py-1 text-red-500">
                          -₹{discount.toFixed(2)}
                        </td>
                      </tr>
                    }
                    <tr>
                      <td>GST (18%)</td>
                      <td className="text-right py-1 text-green-600">
                        +₹{gst.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="font-semibold">
                      <td>Total Payable</td>
                      <td className="text-right py-1 text-indigo-600">
                        ₹{total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-600 uppercase text-sm pb-3">Booking Details</p>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <div className="relative flex items-center">
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={formData.contact}
                    disabled={otpVerified}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    className="w-full border rounded-lg px-2 py-2 text-sm disabled:bg-gray-100"
                  />
                  {!otpSent && (
                    <button
                      onClick={handleSendOtp}
                      disabled={loadingOtp || formData.contact.length < 10}
                      className="absolute cursor-pointer disabled:cursor-not-allowed right-2 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full disabled:opacity-60 hover:shadow-sm duration-300"
                    >
                      {loadingOtp ? "Sending..." : "Send OTP"}
                    </button>
                  )}
                </div>
                {otpSent && !otpVerified && (
                  <div className="flex flex-row items-center justify-between gap-2 mt-3">
                    <input
                      type="number"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 border rounded-lg px-4 py-2 text-sm"
                    />
                    <button
                      onClick={verifyOtp}
                      disabled={loadingOtp}
                      className="h-min cursor-pointer disabled:cursor-not-allowed text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full disabled:opacity-60 hover:shadow-sm duration-300"
                    >
                      {loadingOtp ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                )}
                {otpVerified && (
                  <p className="text-green-600 text-xs text-right mt-px">
                    ✔ Mobile number verified
                  </p>
                )}
                {error && (
                  <p className="text-red-500 text-xs text-right">
                    {error}
                  </p>
                )}
                <div className="flex flex-col gap-3 mt-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border rounded-lg px-2 py-1.5 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border rounded-lg px-2 py-1.5 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <textarea
                    rows={2}
                    placeholder="Address"
                    className="w-full border rounded-lg px-2 py-1.5 text-sm resize-none"
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <p className="text-xs text-gray-500 text-center mt-4 mb-1">
                  Secure payment powered by Razorpay
                </p>
                <button
                  disabled={!otpVerified || loadingPay}
                  onClick={handlePayment}
                  className="text-sm w-full bg-indigo-600 hover:bg-indigo-700 hover:shadow-md duration-300 text-white py-2 rounded-full cursor-pointer"
                >
                  {loadingPay ? "Processing..." : "Proceed payment"}
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-1">
                  By continuing, you agree to our Terms & Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-6 space-y-4">

        <div className="text-center">
          <h2 className="text-lg font-semibold">Complete Booking</h2>
          <p className="text-xs text-gray-500">
            Secure checkout powered by Razorpay
          </p>
        </div>


        <div className="relative">
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.contact}
            disabled={otpVerified}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            className="w-full border rounded-xl px-4 py-3 text-sm disabled:bg-gray-100"
          />
          {!otpSent && (
            <button
              onClick={sendOtp}
              disabled={loadingOtp}
              className="absolute right-2 top-2 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-60"
            >
              {loadingOtp ? "Sending..." : "Send OTP"}
            </button>
          )}
        </div>


        {otpSent && !otpVerified && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-3 text-sm"
            />
            <button
              onClick={verifyOtp}
              disabled={loadingOtp}
              className="bg-indigo-600 text-white px-4 rounded-xl text-sm disabled:opacity-60"
            >
              {loadingOtp ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}


        {otpVerified && (
          <p className="text-green-600 text-xs text-center font-medium">
            ✔ Mobile number verified
          </p>
        )}

        {error && (
          <p className="text-red-500 text-xs text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-xl px-4 py-3 text-sm"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border rounded-xl px-4 py-3 text-sm"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <textarea
          rows={2}
          placeholder="Address"
          className="w-full border rounded-xl px-4 py-3 text-sm resize-none"
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />

        <button
          disabled={!otpVerified || loadingPay}
          onClick={handlePayment}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition"
        >
          {loadingPay ? "Processing..." : "Book Now"}
        </button>

        <p className="text-[10px] text-center text-gray-400">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div> */}
    </>
  );
}
