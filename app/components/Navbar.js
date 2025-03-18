"use client"

// React hooks
import { useState } from 'react';

// Firebase
import { getAuth } from '@/app/firebaseConfig';

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';

// Images/Logos
import Image from 'next/image';
import logo from "@/public/press_know_logo.png";

// Navigation
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';




export default function Navbar() {


    const pathName = usePathname();

    const navItems = [
        { name: 'Dashboard', path: '/Pages/dashboard' },
        { name: 'Email Campaigns', path: '#' },
        { name: 'Contacts', path: '/Pages/contacts' },
        { name: 'Templates', path: '#' },
        { name: 'Reports', path: '#' },
        { name: 'Billing & Subscription', path: '#' },
        { name: 'Settings', path: '#' },
    ];


    const router = useRouter();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [showPopover, setShowPopover] = useState(false);

    const auth = getAuth();


    const handleSignOut = () => {
        auth.signOut();
        router.push("/");
    }


    return (
        <>
            <div className="d-flex">
                {/* Sidebar */}
                <div className={`position-relative`}>
                    <div className={`navbar-color position-fixed text-white p-4`} style={{ width: '250px', minHeight: '100vh', zIndex: 1050, transition: 'all 0.5s ease-in-out', transform: `${sidebarOpen ? 'translateX(0)' : 'translateX(-251px)'}` }}>
                        {/* <h4 className="mb-4">PRESS KNOW DIGITAL</h4> */}
                        <Image src={logo} alt='PressKnow Digital' height={40} className="press-know-logo me-auto"></Image>
                        <nav className="nav flex-column pt-5">
                            {navItems.map((item, index) => (

                                <Link key={index} href={item.path} className={`nav-link ${pathName === item.path ? 'active-link' : 'text-white'}`}>{item.name}</Link>
                            ))}
                        </nav>
                    </div>

                    <div className={`${sidebarOpen ? '' : 'd-none'} position-absolute`} onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: '100vw', minHeight: '100vh', zIndex: 1049, transition: 'all 0.3s ease-in-out', backgroundColor: "grey", opacity: "0.5" }}></div>
                </div>


                {/* Main Content */}
                <div className="flex-grow-1">
                    {/* Header */}
                    <div className="navbar-color text-white p-3 d-flex justify-content-between align-items-center" >
                        <button className="btn btn-outline-light me-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        {/* <input type="text" className="form-control w-50" placeholder="Type here to search" /> */}
                        <Image src={logo} alt='PressKnow Digital' height={40} className="me-auto press-know-logo"></Image>
                        <div className="d-flex align-items-center position-relative">
                            <FontAwesomeIcon className="me-3" icon={faBell} />
                            <span className="me-3">User name</span>
                            <button className='btn'
                                style={{ backgroundColor: 'transparent', border: 'none' }}
                                onClick={() => setShowPopover(!showPopover)}
                            >
                                <FontAwesomeIcon color='white' icon={faUserCircle} />
                            </button>
                            {showPopover && (
                                <div className="custom-popover">
                                    <Link href="/profile" className="popover-item">Profile</Link>
                                    <Link href="#" onClick={handleSignOut} className="popover-item">Log Out</Link>
                                    <Link href="/upgrade" className="popover-item">Upgrade Plan</Link>
                                    <div className="popover-arrow" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
