import { Link } from "react-router";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const logo = "https://i.ibb.co/4wK6q5DH/logo.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content mt-12 border-t border-base-300">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 — Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src={logo}
                alt="My Building logo"
                className="w-10 h-10 rounded-full"
              />
              <h3 className="text-2xl font-bold">My Building</h3>
            </div>
            <p className="text-base-content/70">
              Modern living made simple — comfort, community, and convenience.
            </p>
          </div>

          {/* Column 2 — Navigate (only real routes/sections) */}
          <nav aria-label="Footer navigation" className="flex flex-col">
            <h3 className="footer-title">Navigate</h3>
            <Link to="/" className="link link-hover">
              Home
            </Link>
            <Link to="/apartments" className="link link-hover">
              Apartments
            </Link>
            <Link to="/contact" className="link link-hover">
              Contact
            </Link>
            {/* In-page section (About) exists via #about Section id */}
            <a href="#about" className="link link-hover">
              About Us
            </a>

            {/* Non-existent pages shown as plain text to avoid dead links */}
            <span className="mt-2 text-sm text-base-content/60">
              Privacy Policy (coming soon)
            </span>
            <span className="text-sm text-base-content/60">
              Terms &amp; Conditions (coming soon)
            </span>
          </nav>

          {/* Column 3 — Follow Us */}
          <div>
            <h3 className="footer-title">Follow Us</h3>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Facebook"
                className="text-2xl hover:opacity-80 transition"
              >
                <FaFacebook />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on X (Twitter)"
                className="text-2xl hover:opacity-80 transition"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View our GitHub"
                className="text-2xl hover:opacity-80 transition"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-base-300 text-center text-sm text-base-content/60">
          © {year} My Building Ltd. — Providing affordable living since 2023
        </div>
      </div>
    </footer>
  );
};

export default Footer;
