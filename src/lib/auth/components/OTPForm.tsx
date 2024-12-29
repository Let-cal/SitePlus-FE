import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth/services/auth.service";
import { enqueueSnackbar } from "notistack";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "@/lib/all-site/Heading";
const OTPForm: React.FC = () => {
  const [otp, setOTP] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  // Lấy email từ localStorage khi component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOTP = [...otp];
    newOTP[index] = element.value;
    setOTP(newOTP);

    // Handle paste
    if (element.value.length > 1) {
      const pastedValue = element.value.split("");
      const remainingFields = 6 - index;
      const validPastedValues = pastedValue.slice(0, remainingFields);

      const newFilledOTP = [...otp];
      validPastedValues.forEach((value, i) => {
        if (index + i < 6) {
          newFilledOTP[index + i] = value;
        }
      });
      setOTP(newFilledOTP);

      // Focus on next empty field or last field
      const nextIndex = Math.min(index + validPastedValues.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else if (element.value) {
      // Focus next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current field is empty and backspace is pressed, focus previous field
        const newOTP = [...otp];
        newOTP[index - 1] = "";
        setOTP(newOTP);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current field
        const newOTP = [...otp];
        newOTP[index] = "";
        setOTP(newOTP);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      enqueueSnackbar("Please enter all 6 digits", {
        variant: "error",
        preventDuplicate: true,
        anchorOrigin: {
          horizontal: "left",
          vertical: "bottom",
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      if (!email) {
        throw new Error("Email not found");
      }

      const response = await authService.verifyOTP({
        email,
        codeOTP: otpValue,
      });

      if (response.success) {
        enqueueSnackbar("OTP verified successfully", {
          variant: "success",
          preventDuplicate: true,
          anchorOrigin: {
            horizontal: "left",
            vertical: "bottom",
          },
        });
        navigate("/reset_page");
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Verification failed",
        {
          variant: "error",
          preventDuplicate: true,
          anchorOrigin: {
            horizontal: "left",
            vertical: "bottom",
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        
        <Heading text="Enter OTP Code" hasMargin={false} size="sm"/>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit code sent to your email <br />
          <span className="font-bold text-orange-500">{email || ""}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={6}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:border-orange-500 focus:outline-none"
              disabled={isLoading}
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </div>
  );
};

export default OTPForm;
