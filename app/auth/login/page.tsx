"use client"

import SigninFormDemo from '@/components/Login'
import { SessionProvider } from 'next-auth/react'

const page = () => {
  return (
    <SessionProvider>
    <SigninFormDemo/></SessionProvider>
  )
}

export default page