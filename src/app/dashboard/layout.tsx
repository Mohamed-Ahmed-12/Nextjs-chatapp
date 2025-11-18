import { SideBarComp } from '@/src/components/dashboard/sidebar'
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-dvh'>
      <div className='w-6/12 md:w-3/12'>
        <SideBarComp />
      </div>

      <div className='w-6/12 md:w-9/12'>
        {children}
      </div>

    </div>
  )
}
