import * as React from 'react';

const AreaMap: React.FC = () => {
  return (
    <div className="w-full h-96">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.148011202223!2d106.6502381745174!3d10.799973758759986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529362ae8bd69%3A0x885224e3b030cc27!2zMTMgUXXDoWNoIFbEg24gVHXhuqVuLCBQaMaw4budbmcgMTIsIFTDom4gQsOsbmgsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1735981241706!5m2!1svi!2s"
        width="100%"
        height="100%"
        style={{ border: '0' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default AreaMap;
