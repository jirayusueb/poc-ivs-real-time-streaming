'use client'

import dynamic from 'next/dynamic'

const HomePage = dynamic(() => import('@/containers/home-page'), { ssr: false })

export default function page() {
  return <HomePage />
}

// ref: https://codepen.io/amazon-ivs/project/editor/ZzWobn
