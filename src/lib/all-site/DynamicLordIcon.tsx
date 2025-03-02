import * as React from 'react';
import { useTheme } from './ThemeProvider'; // Đường dẫn đến context của bạn

const DynamicLordIcon = () => {
  const { isDarkMode } = useTheme();
  
  // Chọn màu dựa vào theme hiện tại
  const primaryColor = isDarkMode ? "#ffffff" : "#66d7ee"; // Sáng khi ở dark mode
  const secondaryColor = isDarkMode ? "#a8e6cf" : "#08a88a"; // Sáng khi ở dark mode
  
  return (
    <lord-icon
      src="https://cdn.lordicon.com/kdduutaw.json"
      trigger="loop"
      delay="2000"
      state="morph-group"
      colors={`primary:${primaryColor},secondary:${secondaryColor}`}
      style={{ width: "24px" }}
    />
  );
};

export default DynamicLordIcon;