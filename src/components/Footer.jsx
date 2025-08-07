import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const logo = "https://i.ibb.co/4wK6q5DH/logo.png";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-y-8 gap-x-10">
        {/* Column 1 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <h3 className="text-2xl font-bold">My Building</h3>
          </div>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Terms & Conditions</a>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col">
          <h3 className="footer-title">Support</h3>
          <a className="link link-hover">Help Center</a>
          <a className="link link-hover">FAQs</a>
          <a className="link link-hover">Report a Problem</a>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col">
          <h3 className="footer-title">Follow Us</h3>
          <div className="grid grid-flow-col gap-4 mt-2 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <FaXTwitter />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 text-center text-sm text-gray-500">
        © 2025 My Building Ltd. — Providing affordable living since 2023
      </div>
    </footer>
  );
};

export default Footer;
