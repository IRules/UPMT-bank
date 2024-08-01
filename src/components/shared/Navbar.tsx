import React from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const Navbar = () => {
    return (
        <div className="flex justify-end items-center px-10 py-5">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    )
}
export default Navbar
