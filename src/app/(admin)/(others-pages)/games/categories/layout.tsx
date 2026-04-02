import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Game Categories Management',
  description: 'Game Categories Management page for Two X Admin Dashboard',
  // other metadata
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default layout
