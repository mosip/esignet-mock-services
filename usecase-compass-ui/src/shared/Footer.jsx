const Footer = () => {
    return (
        <footer className="footer h-[8%] text-center sm:footer-horizontal footer-center bg-[#F3F0E8] text-base-content py-4 z-10 relative" style={{ boxShadow: '0 -2px 6px rgba(0,0,0,0.1)' }}>
            <aside>
                <p className="text-[#717171]">© {new Date().getFullYear()} Inji. All rights reserved.</p>
            </aside>
        </footer>
    )
};

export default Footer;