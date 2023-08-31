import React from "react";

const Footer = () => {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} Grace Shopper/Cycle's-R-Us. All rights reserved.</p>
            <p>Devlopers: 
                <a className="developers"> Floyd "Trei" Feske III, Cameron McEachin, Scarlette Oteo, and Henry Zhang (Name's listed in alphabetical order)</a> 
            </p>
        </footer>
    );
}

export default Footer;