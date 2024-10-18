export default function Footer() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return (
        <div className="px-10 bg-[#00507C] h-[64px] ">
            <div className="grid grid-cols-1 h-full">
                <div className="flex items-center justify-center w-full">
                    <p className="text-xs lg:text-base text-center md:text-start text-white">
                        Copyright &copy; {currentYear} BVK Test By Hilal Akbar
                        All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
