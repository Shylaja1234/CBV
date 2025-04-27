import Logo from "@/components/shared/Logo";
import { PhoneCall, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Logo className="mb-4" />
            <p className="text-muted-foreground text-sm max-w-xs">
              Pioneering IT infrastructure solutions and cybersecurity services for businesses across India and beyond.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" aria-label="LinkedIn" className="text-foreground/70 hover:text-primary transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-foreground/70 hover:text-primary transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="text-foreground/70 hover:text-primary transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.644c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/#about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="/#services" className="text-muted-foreground hover:text-foreground transition-colors">IT Services</a></li>
              <li><a href="/#products" className="text-muted-foreground hover:text-foreground transition-colors">Products</a></li>
              <li><a href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="/#" className="text-muted-foreground hover:text-foreground transition-colors">Network Solutions</a></li>
              <li><a href="/#" className="text-muted-foreground hover:text-foreground transition-colors">Cloud Services</a></li>
              <li><a href="/#" className="text-muted-foreground hover:text-foreground transition-colors">Cybersecurity</a></li>
              <li><a href="/#" className="text-muted-foreground hover:text-foreground transition-colors">IT Infrastructure</a></li>
              <li><a href="/#" className="text-muted-foreground hover:text-foreground transition-colors">Managed Services</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Plot No. 225B, Shop No. 13. Paramount House<br />
                  Panvel, Navi Mumbai, Maharashtra 410206<br />
                  India
                </span>
              </li>
              <li className="flex items-center">
                <PhoneCall className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <a href="tel:+918779380760" className="text-muted-foreground hover:text-foreground transition-colors">
                  +91 877 938 0760
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <a href="mailto:contact@connectingbee.in" className="text-muted-foreground hover:text-foreground transition-colors">
                  contact@connectingbee.in
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} ConnectingBee Ventures. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
