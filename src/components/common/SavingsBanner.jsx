"use client"

import React from 'react'
import { Sparkles } from 'lucide-react'

function SavingsBanner({ discountAmount }) {
  return (
    <div className='w-full px-3 py-2 flex items-center justify-start border border-emerald-500 text-emerald-500 rounded-lg bg-emerald-50'>
      <div className='flex items-center justify-start flex-row gap-3'>
        <Sparkles className='' size={14} />
        <p className=''><span className='font-semibold'><span className="font-sans">₹</span>{discountAmount} saved!</span> On this booking</p>
      </div>
    </div>
  )
}

export default SavingsBanner