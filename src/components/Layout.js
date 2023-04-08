import React from 'react'
import Header from './Header'
import ApiLoader from './ApiLoader'

function Layout() {
  return (
    <>
      <ApiLoader/>
      <Header/>
    </>
  )
}

export default Layout