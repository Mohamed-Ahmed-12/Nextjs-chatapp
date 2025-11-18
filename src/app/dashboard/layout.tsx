import { SideBarComp } from '@/src/components/dashboard/sidebar'
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-dvh'>
      <div className='w-4/12 md:w-2/12'>
        <SideBarComp />
      </div>

      <div className='w-8/12 md:w-10/12'>
        {children}
      </div>

    </div>
  )
}
