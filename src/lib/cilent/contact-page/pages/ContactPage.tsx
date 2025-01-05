import * as React from "react";
import { Footer } from "../../../all-site/Footer";
import { Header } from "../../../all-site/Header";
import ContactContent from "../components/ContactContent";

function ContactPage() {
  return (
    <div>
      <Header />
      <ContactContent />
      {/* Google Map Embed */}
      <div className="w-full aspect-w-16 aspect-h-10 h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31353.203616443876!2d106.6326723880796!3d10.79978669499917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529362ae8bd69%3A0x885224e3b030cc27!2zMTMgUXXDoWNoIFbEg24gVHXhuqVuLCBQaMaw4budbmcgMTIsIFTDom4gQsOsbmgsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1736004601537!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <Footer />
    </div>
  );
}

export default ContactPage;
