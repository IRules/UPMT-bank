import React from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const SidebarRight = () => {
    return (
        <div className="min-w-96 flex flex-col px-10 py-20 gap-20 h-full bg-gray-900">
            <section className="flex w-full justify-end">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </section>
            <section>
                <h1 className="text-2xl font-bold">
                    My transactions
                </h1>
                <div className="flex flex-col gap-5 py-5">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-lg font-semibold">
                                Comisia
                            </h1>
                            <p>{new Date().toLocaleDateString()}</p>
                            <p>BTRL123456789</p>
                        </div>
                        <p className="text-xl font-bold">
                            250$
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default SidebarRight
