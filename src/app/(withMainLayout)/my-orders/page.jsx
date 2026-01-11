"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getUserBookings, verifyOtpApi, sendOtp } from "@/services/handlers";
import { Download } from "lucide-react";
import useUserStore from "@/store/useUserStore";

const Page = () => {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [token, setToken] = useState(undefined);
  const [otpVerified, setOtpVerified] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [errorOtp, setErrorOtp] = useState("");
  const [phone, setPhone] = useState("");

  /* ---------- MOUNT ---------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------- READ COOKIE AFTER MOUNT ---------- */
  useEffect(() => {
    if (!mounted) return;

    const savedToken = Cookies.get("token");

    if (savedToken) {
      setToken(savedToken);
      setOtpVerified(true);
    } else {
      setOtpVerified(false);
    }
  }, [mounted]);

  /* ---------- FETCH BOOKINGS ---------- */
  useEffect(() => {
    if (!mounted || !user?.id || !otpVerified) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUserBookings(user.id);
        setBookings(data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [mounted, user, otpVerified]);

  /* ---------- SEND OTP ---------- */
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setErrorOtp("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoadingOtp(true);
      setErrorOtp("");
      await sendOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setErrorOtp(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setErrorOtp("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoadingOtp(true);
      setErrorOtp("");

      const response = await verifyOtpApi({ phone, otp });

      Cookies.set("token", response.token);
      setToken(response.token);
      setOtpVerified(true);

      setUser({
        id: response.user._id,
        mobile: response.user.phone,
      });
    } catch (err) {
      setErrorOtp(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoadingOtp(false);
    }
  };

  /* ---------- PREVENT HYDRATION ---------- */
  if (!mounted) return null;

  if (loading) return <p className="mt-24">Loading...</p>;
  if (error) return <p className="mt-24">{error}</p>;

  return (
    <>
      {!otpVerified && (
        <div className="bg-black/50 w-full h-screen fixed top-0 z-10 flex items-center justify-center">
          <div className="bg-white rounded-xl md:rounded-2xl w-72 sm:w-80 p-5 shadow-2xl flex flex-col gap-3">
            <p className="text-center text-sm mb-2">
              Verify your mobile number to view bookings
            </p>

            <div className="relative flex items-center">
              <input
                type="tel"
                value={phone}
                placeholder="Mobile number"
                className="w-full border rounded-lg p-2 text-sm"
                onChange={(e) => setPhone(e.target.value)}
              />

              {!otpSent && (
                <button
                  onClick={handleSendOtp}
                  disabled={loadingOtp || phone.length !== 10}
                  className="absolute right-2 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full cursor-pointer"
                >
                  {loadingOtp ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>

            {otpSent && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 border rounded-lg p-2 text-sm"
                />
                <button
                  onClick={verifyOtp}
                  disabled={loadingOtp}
                  className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full cursor-pointer"
                >
                  {loadingOtp ? "Verifying..." : "Verify"}
                </button>
              </div>
            )}

            {errorOtp && (
              <p className="text-red-500 text-xs text-right">{errorOtp}</p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full flex flex-col gap-4 px-4 sm:px-7 mb-10 mt-24">
        <div>
          <h2 className="flex items-center text-center w-full justify-center text-indigo-500 font-bold uppercase text-3xl md:text-4xl my-5">
            My Orders
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl shadow-sm w-full h-min">
          <div className="overflow-x-auto">
            <table className="w-full bg-white border-collapse">
              <thead className="bg-gray-100 text-gray-600">
                <tr className="text-sm">
                  <th className="px-3 py-3 text-left font-medium">Booking Date</th>
                  <th className="px-3 py-3 text-left font-medium">Name</th>
                  <th className="px-3 py-3 text-left font-medium">Email</th>
                  <th className="px-3 py-3 text-center font-medium">Items Count</th>
                  <th className="px-3 py-3 text-center font-medium">Amount</th>
                  <th className="px-3 py-3 text-center font-medium">Status</th>
                  <th className="px-3 py-3 text-center font-medium">Download</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-t border-gray-200 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-3 py-3">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-3 font-medium min-w-48">
                        {booking.name}
                      </td>
                      <td className="px-2 py-3">{booking.email}</td>
                      <td className="px-2 py-3 text-center">
                        {booking.items.length}
                      </td>
                      <td className="px-2 py-3 text-center font-semibold text-indigo-600">
                        ₹{booking.summary.total.toFixed(2)}
                      </td>
                      <td className="px-2 py-3 text-center capitalize">
                        {booking.status}
                      </td>
                      <td className="p-3 flex justify-center">
                        <Download className="text-indigo-600 cursor-pointer" size={16} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-sm text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p
          className="underline cursor-pointer text-indigo-600 text-sm"
          onClick={() => router.push("/")}
        >
          Go home to book more.
        </p>
      </div>
    </>
  );
};

export default Page;