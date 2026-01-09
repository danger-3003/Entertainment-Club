import MainLayout from '@/components/structure/MainLayout'
import React from 'react'

function layout({ children }) {
  return (
    <>
      <MainLayout>
        {children}
      </MainLayout>
    </>
  )
}

export default layout