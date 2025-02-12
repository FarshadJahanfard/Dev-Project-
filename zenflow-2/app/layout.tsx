import "@/styles/globals.css"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import type React from "react" // Import React

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata = {
  title: "ZenFlow - Luxury Dining Experience",
  description: "Experience luxury dining with our sophisticated reservation system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'