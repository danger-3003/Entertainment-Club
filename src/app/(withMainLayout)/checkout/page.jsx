/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRazorpay } from "react-razorpay";
import { sendOtp, verifyOtpApi, createOrderApi, eventBooking } from "@/services/handlers";
import Cookies from "js-cookie";
import useEventCartStore from "@/store/useEventCartStore";
import useUserStore from "@/store/useUserStore";
import useBookingStatus from "@/store/useBookingStatus";
import SavingsBanner from "@/components/common/SavingsBanner";

const RAZORPAY_PUBLIC_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_PUBLIC_KEY_ID;
export default function PaymentPage() {
  const {
    selectedEvents,
    isCouponApplied,
    resetCoupon,
    resetSelectedEvents
  } = useEventCartStore();

  const {
    user,
    setUser,
    resetUser
  } = useUserStore();

  const { setBooking } = useBookingStatus();

  const COUPON_MIN_AMOUNT = 1000;
  const COUPON_DISCOUNT_PERCENT = 30;
  const CURRENCY = "INR";

  const router = useRouter();

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

  const { Razorpay } = useRazorpay();

  const [token, setToken] = useState(() => Cookies.get("token"));

  const [otpVerified, setOtpVerified] = useState(!!token);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    bookingDate: "",
    phone: user.mobile,
    name: "",
    email: "",
    address: "",
  });

  const buildBookingPayload = (paymentResponse) => ({
    userId: user.id,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,

    items: selectedEvents,

    summary: {
      subTotal: subTotal.toFixed(2),
      gst: gst.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      discountApplied: isCouponApplied,
      discountPercent: isCouponApplied ? COUPON_DISCOUNT_PERCENT : 0,
    },

    payment: {
      paymentId: paymentResponse.razorpay_payment_id,
      orderId: paymentResponse.razorpay_order_id,
      amount: total,
      currency: CURRENCY,
    },

    bookingDate: new Date(formData.bookingDate).toISOString(),
  });

  const [fieldErrors, setFieldErrors] = useState({});

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoadingOtp(true);
      setError("");

      const data = await sendOtp(formData.phone);
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

      const response = await verifyOtpApi({
        phone: formData.phone,
        otp,
      });

      Cookies.set("token", response.token);
      setToken(response.token);
      setOtpVerified(true);

      setUser({
        "id": response.user._id,
        "mobile": response.user.phone
      })

      setOtpVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoadingOtp(false);
    }
  };

  const validateFields = () => {
    const errors = {};

    if (!formData.bookingDate) errors.bookingDate = true;
    if (!formData.phone || formData.phone.length !== 10) errors.phone = true;
    if (!formData.name.trim()) errors.name = true;
    if (!formData.email.trim()) errors.email = true;
    if (!formData.address.trim()) errors.address = true;

    if (!token && !otpVerified) {
      errors.otp = true;
      setError("Please verify your mobile number");
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    if (!formData.bookingDate) return false;
    if (!formData.phone || formData.phone.length !== 10) return false;
    if (!formData.name.trim()) return false;
    if (!formData.email.trim()) return false;
    if (!formData.address.trim()) return false;
    return true;
  };

  const handlePayment = async () => {
    if (!validateFields()) return;

    try {
      setLoadingPay(true);

      const amount = Math.round(total * 100);

      const order = await createOrderApi({
        amount,
        currency: CURRENCY,
      });

      const options = {
        key: RAZORPAY_PUBLIC_KEY_ID,
        amount,
        currency: CURRENCY,
        name: "Booking",
        description: "Event Booking Payment",
        order_id: order.id,

        prefill: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },

        handler: async function (response) {
          try {
            const payload = buildBookingPayload(response);

            await eventBooking(payload);

            resetCoupon();
            resetSelectedEvents();

            alert("Payment & Booking Successful!");
            setBooking(true);
            router.push("/");
          } catch (err) {
            console.error(err);
            alert("Booking failed after payment");
          }
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

  console.log(new Date().toISOString());

  return (
    <>
      <div className="max-w-5xl w-full flex flex-col gap-4 px-4 sm:px-7 mb-10 mt-24">
        <SavingsBanner
          discountAmount={discount}
        />
        <div className="h-32 p-2 px-5 w-full bg-gray-100 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold uppercase">
              Checkout
            </h2>
            <p className="text-sm">Enjoy 30% instant discount on your total bill when you spend ₹999 or more.</p>
          </div>
          <img src="/CartHeader.svg" alt="CartHeader" className="w-32" />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* TABLE */}
          <div className="w-full">
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
                              <span className="font-sans">₹</span>{itemTotal}
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
            <p className="mt-3 underline cursor-pointer text-indigo-600 text-sm" onClick={() => { router.push("/") }}>Go home to book more.</p>
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
                        <p className="text-sm text-right font-medium">Get 30% OFF on orders above ₹999</p>
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
            {
              selectedEvents.length > 0 &&
              <>
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
                          <td className="text-right py-1"><span className="font-sans">₹</span>{subTotal.toFixed(2)}</td>
                        </tr>
                        {
                          isCouponApplied &&
                          <tr>
                            <td>Discount ({COUPON_DISCOUNT_PERCENT}%)</td>
                            <td className="text-right py-1 text-red-500">
                              -<span className="font-sans">₹</span>{discount.toFixed(2)}
                            </td>
                          </tr>
                        }
                        <tr>
                          <td>GST (18%)</td>
                          <td className="text-right py-1 text-green-600">
                            +<span className="font-sans">₹</span>{gst.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="font-semibold">
                          <td>Total Payable</td>
                          <td className="text-right py-1 text-indigo-600">
                            <span className="font-sans">₹</span>{total.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-600 uppercase text-sm pb-3">Booking Details</p>
                  <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                    <input
                      type="date"
                      className={`w-full border rounded-lg px-2 py-1.5 text-sm mb-3 
                    ${fieldErrors.bookingDate ? "border-red-500" : ""}`}
                      value={formData.bookingDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setFormData({ ...formData, bookingDate: e.target.value })
                      }
                    />
                    {/* Show OTP section ONLY if no token */}
                    {!token && !otpVerified ? (
                      <>
                        <div className="relative flex items-center">
                          <input
                            type="tel"
                            value={formData.phone}
                            placeholder="Mobile number"
                            disabled={otpVerified}
                            className={`w-full border rounded-lg px-2 py-1.5 text-sm
                          ${fieldErrors.phone ? "border-red-500" : "border-gray-300"}`}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />

                          {!otpSent && (
                            <button
                              onClick={handleSendOtp}
                              disabled={loadingOtp || formData.phone.length !== 10}
                              className="absolute right-2 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full cursor-pointer"
                            >
                              {loadingOtp ? "Sending..." : "Send OTP"}
                            </button>
                          )}
                        </div>

                        {/* OTP Verify */}
                        {otpSent && !otpVerified && (
                          <div className="flex gap-2 mt-3 items-center">
                            <input
                              type="number"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="flex-1 border rounded-lg px-2 py-1.5 text-sm"
                            />
                            <button
                              onClick={verifyOtp}
                              disabled={loadingOtp}
                              className="text-xs bg-indigo-600 text-white px-3 py-1.5 h-min rounded-full cursor-pointer"
                            >
                              {loadingOtp ? "Verifying..." : "Verify"}
                            </button>
                          </div>
                        )}
                      </>
                    )
                      :
                      <div className="relative flex items-center">
                        <input
                          type="tel"
                          value={formData.phone}
                          className={`w-full border rounded-lg px-2 py-1.5 text-sm
                        ${fieldErrors.phone ? "border-red-500" : "border-gray-300"}`}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="Mobile Number"
                          disabled={otpVerified || !!token}
                          required
                        />
                      </div>
                    }
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
                        className={`w-full border rounded-lg px-2 py-1.5 text-sm
                      ${fieldErrors.name ? "border-red-500" : "border-gray-300"}`}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className={`w-full border rounded-lg px-2 py-1.5 text-sm
                      ${fieldErrors.email ? "border-red-500" : "border-gray-300"}`}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }

                        required
                      />
                      <textarea
                        rows={2}
                        placeholder="Address"
                        className={`w-full border rounded-lg px-2 py-1.5 text-sm resize-none
                      ${fieldErrors.address ? "border-red-500" : "border-gray-300"}`}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }

                        required
                      />
                    </div>

                    <p className="text-[10px] text-center text-gray-400 mt-4 mb-1">
                      Secure payment powered by Razorpay
                    </p>
                    <button
                      disabled={loadingPay || !isFormValid() || (!token && !otpVerified)}
                      onClick={handlePayment}
                      className="text-sm w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer
                    disabled:bg-indigo-200 disabled:cursor-not-allowed 
                    hover:shadow-md duration-300 text-white py-2 rounded-full
                  "
                    >
                      {loadingPay ? "Processing..." : "Proceed payment"}
                    </button>

                    {/* <button
                  disabled={loadingPay || (!getToken && !otpVerified) || validateFields}
                  onClick={handlePayment}
                  className="text-sm w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:cursor-not-allowed hover:shadow-md duration-300 text-white py-2 rounded-full cursor-pointer"
                >
                  {loadingPay ? "Processing..." : "Proceed payment"}
                </button> */}
                    <p className="text-[10px] text-center text-gray-400 mt-1">
                      By continuing, you agree to our Terms & Privacy Policy
                    </p>
                  </div>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
}
