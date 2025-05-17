"use client"
import VapiTalk from '@/components/VapiTalk'
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <SignedOut>
        <SignInButton/>
      </SignedOut>
      <SignedIn>
        <VapiTalk/>
        <SignOutButton/>
      </SignedIn>
    </div>
  )
}

export default page
