import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Adventure Thrill City | Vishwanadh Sports Club",
  description:
    "Adventure Thrill City at Vishwanadh Sports Club offers exciting adventure games, thrill rides, kids and adult activities, outdoor sports, and fun experiences for families, friends, and groups.",
  keywords: [
    "Adventure Thrill City",
    "Vishwanadh Sports Club",
    "adventure park",
    "thrill rides",
    "kids adventure activities",
    "adult adventure games",
    "outdoor sports activities",
    "family entertainment park",
    "adventure games in India",
    "sports club adventure park"
  ],
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
