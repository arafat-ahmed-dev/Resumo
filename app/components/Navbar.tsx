import React from 'react';
import {Link} from "react-router";
import {usePuterStore} from "~/lib/puter";


const Navbar = () => {
    const {auth} = usePuterStore()
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMO</p>
            </Link>
            <div className="flex items-center justify-center gap-4 ">
                {auth.user?.username == import.meta.env.VITE_AUTHER &&
                    <Link to="/wiper" className="back-button font-bold text-gradient">Wipe</Link>}
                <Link to="/upload" className="primary-button w-fit">Upload Resume</Link>
            </div>
        </nav>
    );
}

export default Navbar;