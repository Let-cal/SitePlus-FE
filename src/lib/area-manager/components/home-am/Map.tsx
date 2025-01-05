import * as React from 'react';

const AreaMap: React.FC = () => {
  return (
    <div className="w-full h-96">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125400.43494700313!2d106.73697977015031!3d10.82939527959517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175212ab5343243%3A0x30cabe757eafaf0!2zUXXhuq1uIDksIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1736064117308!5m2!1svi!2s"
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
