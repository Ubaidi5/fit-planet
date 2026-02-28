import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiOutlineLightningBolt } from "react-icons/hi";

const footerLinks = {
  product: [
    { href: "/gyms", label: "Find Gyms" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/app/routines", label: "Workout Routines" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
    { href: "/blog", label: "Blog" },
  ],
  forOwners: [
    { href: "/studio/register", label: "Register Your Gym" },
    { href: "/studio/login", label: "Gym Owner Login" },
    { href: "/studio-features", label: "Features" },
    { href: "/success-stories", label: "Success Stories" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: <FaFacebook className="h-5 w-5" />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram className="h-5 w-5" />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: <FaTwitter className="h-5 w-5" />,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: <FaYoutube className="h-5 w-5" />,
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <HiOutlineLightningBolt className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Fit Planet
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Your gym service broker. Discover, book, and manage gym
              memberships with ease. No physical cards needed.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors hover:text-emerald-600"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-emerald-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-emerald-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Gym Owners Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              For Gym Owners
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.forOwners.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-emerald-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-emerald-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Fit Planet. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Made with{" "}
              <span className="text-red-500" aria-label="love">
                ❤️
              </span>{" "}
              for fitness enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
