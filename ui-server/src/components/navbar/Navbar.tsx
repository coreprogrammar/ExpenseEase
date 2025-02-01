import {useState} from "react";
import "./Navbar.module.css";
import {Bars3Icon} from "@heroicons/react/16/solid";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className="flex bg-zinc-800 text-white p-4 sm:items-center sm:flex-row flex-col gap-4">
            <div className="flex items-center gap-2">
                <a onClick={toggleMenu} className="sm:hidden inline-block cursor-pointer">
                    <Bars3Icon className="h-6 w-6"/>
                </a>
                <a href="/" className="text-2xl">ExpenseEase</a>
            </div>
            <ul className={"flex list-none sm:ms-auto gap-4 sm:self-center" + (isMobileMenuOpen ? "" : " hidden")}>
                <li><a href="#">Sign In</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
