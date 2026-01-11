"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserBookings } from "@/services/handlers";
import { Download } from "lucide-react";
import useUserStore from "@/store/useUserStore";

const Page = () => {

  const { user } = useUserStore();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.id) return;

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
  }, [user]);


  if (loading) return <p className="mt-24">Loading...</p>;
  if (error) return <p className="mt-24">{error}</p>;

  return (
    <>
      <div className="max-w-5xl w-full flex flex-col gap-4 px-4 sm:px-7 mb-10 mt-24">
        <div>
          <h2 className="flex items-center text-center w-full justify-center text-indigo-500 font-bold uppercase text-3xl md:text-4xl my-5">My Orders</h2>
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
                  <th className="pl-2 pr-3 py-3 text-center font-medium">Download</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-t border-gray-200 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      {/* Booking Date */}
                      <td className="px-3 py-3">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>

                      {/* Name */}
                      <td className="px-2 py-3 font-medium min-w-48">
                        {booking.name}
                      </td>

                      {/* Email */}
                      <td className="px-2 py-3">
                        {booking.email}
                      </td>

                      {/* Items Count */}
                      <td className="px-2 py-3 text-center">
                        {booking.items.length}
                      </td>

                      {/* Amount */}
                      <td className="px-2 py-3 text-center font-semibold text-indigo-600">
                        ₹{booking.summary.total.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="pl-2 pr-3 py-3 text-center">
                        <span className="capitalize">
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3 flex justify-center">
                        <Download className="text-indigo-600 cursor-pointer" size="16" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-sm text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="underline cursor-pointer text-indigo-600 text-sm" onClick={() => { router.push("/") }}>Go home to book more.</p>
      </div>
    </>
  );
};

export default Page;