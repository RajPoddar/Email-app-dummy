import Image from "next/image";
import { Button } from "react-bootstrap";
import logo from "@/public/press_know_logo.png"; // Ensure the logo is inside the /public folder

export default function Header({ isTrialPage, setSignUp }) {
    return (
        <div className="header-container">
            {/* Logo */}
            <div className="logo-container">
                <Image src={logo} alt="Company Logo" width={180} height={50} />
            </div>

            {/* Start Free Trial Button */}
            {
                isTrialPage ? <div ></div> : <Button className="trial-button" onClick={() => setSignUp(!isTrialPage)}>Get Started For Free</Button>
            }
        </div>
    );
}
