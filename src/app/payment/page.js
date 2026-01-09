"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRazorpay } from "react-razorpay";

const RAZORPAY_PUBLIC_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_PUBLIC_KEY_ID;

export default function PaymentPage({ selectedProduct }) {
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

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
    if (formData.contact.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoadingOtp(true);
      setError("");

      const res = await fetch(
        "https://vishwanadhbackend.vercel.app/api/users/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.contact }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
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

      const res = await fetch(
        "https://vishwanadhbackend.vercel.app/api/users/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formData.contact,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      setOtpVerified(true);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoadingOtp(false);
    }
  };

  /* ---------------- PAYMENT ---------------- */
  const handlePayment = async () => {
    try {
      setLoadingPay(true);

      const amount =
        Number(
          selectedProduct.metadata.actualprice.replace(/,/g, "")
        ) * 100;

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR" }),
      });

      const order = await orderRes.json();

      const options = {
        key: RAZORPAY_PUBLIC_KEY_ID,
        amount,
        currency: "INR",
        name: "Booking",
        description: selectedProduct.metadata.title,
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        handler: () => router.push("/thank-you"),
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-end sm:items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-6 space-y-4">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">Complete Booking</h2>
          <p className="text-xs text-gray-500">
            Secure checkout powered by Razorpay
          </p>
        </div>

        {/* MOBILE */}
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

        {/* OTP */}
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

        {/* VERIFIED */}
        {otpVerified && (
          <p className="text-green-600 text-xs text-center font-medium">
            ✔ Mobile number verified
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-xs text-center">
            {error}
          </p>
        )}

        {/* DETAILS */}
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

        {/* BOOK NOW */}
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
      </div>
    </div>
  );
}
