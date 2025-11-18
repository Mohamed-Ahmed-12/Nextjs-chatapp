<<<<<<< HEAD
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
=======
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
>>>>>>> 3a0b02aec8f4c5b7d47461bef88064dee3062d09
