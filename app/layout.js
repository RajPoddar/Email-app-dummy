"use client"

import { Geist, Geist_Mono } from "next/font/google";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Global CSS
import "./globals.css";

// React Toast
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Component
import Navbar from "./components/Navbar";
import Metadata from "./components/Metadata";

// AuthProvider
import { AuthProvider, useAuth } from '@/app/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Email Marketing App",
//   description: "Generated by create next app",
// };


function MainLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {user && <Navbar />}
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <Metadata />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>

      </body>
    </html>
  );
}
