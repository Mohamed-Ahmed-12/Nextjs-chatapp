import { SideBarComp } from '@/src/components/dashboard/sidebar'
import ProtectedRoute from '@/src/gaurds/ProtectedRoute'
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className='flex flex-col md:flex-row min-h-dvh gap-1'>
        <div className='w-full md:w-3/12'>
          <SideBarComp />
        </div>

        <div className='w-full'>
          {children}
        </div>
      </div>
    </ProtectedRoute>

  )
}
