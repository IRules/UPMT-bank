import {Inter} from "next/font/google";
import SidebarRight from "@/components/shared/SidebarRight";
import Navbar from "@/components/shared/Navbar";
import {Button} from "@/components/ui/button";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
    return (
        <main
            className="flex justify-between h-screen w-full gap-0"
        >
            {/*<Navbar />*/}
            <div className="w-full flex flex-col gap-15 p-20">
                <div className="flex flex-col w-fit gap-5 bg-gray-900 p-14 rounded-lg">
                    <p className="text-2xl">25,685 RON</p>
                    <Button>Add funds</Button>
                </div>
            </div>
            <SidebarRight />
        </main>
    );
}
