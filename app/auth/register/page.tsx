'use client'
import SignupFormDemo from '@/components/Register'
import { SessionProvider } from 'next-auth/react'

const page = () => {
  return (
    <SessionProvider>
    <SignupFormDemo/></SessionProvider>
  )
}

export default page