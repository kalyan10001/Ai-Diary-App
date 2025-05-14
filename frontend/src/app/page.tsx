"use client"
import VapiTalk from '@/components/page'
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <SignedOut>
        <VapiTalk/>
      </SignedOut>
      <SignedIn>
                <SignInButton/>
        <SignOutButton/>
      </SignedIn>
    </div>
  )
}

export default page
