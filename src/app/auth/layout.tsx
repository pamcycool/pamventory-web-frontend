import Image from 'next/image'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='grid grid-cols-2'>

            {children}
            <div className="p-5">
                <div className="hidden lg:flex flex-1 bg-[#1b7339]/10 items-center justify-start rounded-2xl">
                    <div className="w-full h-[95vh] pl-16">
                        {/* Header */}
                        <div className="mb-14 mt-24 ml-10">
                            <h2 className="text-4xl font-bold text-gray-900 text-left">Pamventory AI</h2>
                            <p className="text-lg text-gray-700 text-left">An AI powered Inventory Management for Nigerian SMEs Retailers</p>
                        </div>

                        {/* Dashboard Preview Image Placeholder */}
                        <div className="bg-transparent overflow-hidden">
                            <Image
                                src="/INVENTORY.svg"
                                alt="Pamventory AI Dashboard Preview"
                                width={900}
                                height={400}
                                className="w-full h-[65vh]"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AuthLayout