import { useState } from "react";
import FlightIcon from '@mui/icons-material/Flight';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Router from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
    const supabase = createClientComponentClient();

    const [activeLink, setActiveLink] = useState('trips');

    const handleSignOut = async() => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            Router.replace('/');
        }
    }

    return (
        <>
            <MenuIcon className='nav-hamburger-logo' />
             <div className='navbar-wrapper'>
                <a href="/home" className='logo'>travely</a>

                <ul className='nav-links-ul'>
                    <li className={activeLink === 'trips' ? 'active' : ''}>
                        <FlightIcon />
                        <a href='/home'>My trips</a>
                    </li>
                    <li className={activeLink === 'settings' ? 'active' : ''}>
                        <SettingsIcon />
                        <a>Settings</a>
                    </li>
                </ul>

                <button className='logout-btn' onClick={handleSignOut}>
                    <LogoutIcon />
                    Log out
                </button>
            </div>
        </>
    )
}

export default NavBar;