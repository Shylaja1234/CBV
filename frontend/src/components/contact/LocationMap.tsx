import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

const LocationMap = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-xl overflow-hidden shadow-lg"
    >
      <div className="aspect-[16/7] relative">
        <iframe
          title="ConnectingBee Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9999999999995!2d73.11000000000001!3d19.000000000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c63000000000%3A0x0!2sPanvel%2C%20Navi%20Mumbai%2C%20Maharashtra%20410206!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        
        <div className="absolute bottom-6 left-6 z-10 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-md">
          <div className="flex items-start">
            <div className="mr-3 p-2 rounded-full bg-accent/10 text-accent flex-shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">ConnectingBee Headquarters</h3>
              <p className="text-muted-foreground text-sm">
                Plot No. 225B, Shop No. 13. Paramount House<br />
                Panvel, Navi Mumbai, Maharashtra 410206<br />
                India
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMap;
