import React from 'react'
import { Outlet } from 'react-router'
import AuthIntro from '../Components/AuthIntro/AuthIntro'

function AuthLayout() {
  return (
    <main className=' bg-secondary pt-10'>
        <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-4 px-4 items-center">
                <div className='static order-2 lg-order-1'>
                    <AuthIntro/>
                </div>

                <div className="rout-auth order-1 lg:order-2">
                    <Outlet/>
                </div>
            </div>
        </div>
    </main>
  )
}

export default AuthLayout