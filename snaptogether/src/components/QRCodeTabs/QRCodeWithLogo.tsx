import { useEffect, useRef, forwardRef } from "react";
import QRCodeStyling from "qr-code-styling";

export interface QRCodeWithLogoProps {
  value: string;
  logoImage?: string;
}

export interface QRCodeWithLogoRef {
  download: (filename?: string) => void;
}

const QRCodeWithLogo = forwardRef<QRCodeWithLogoRef, QRCodeWithLogoProps>(
  ({ value, logoImage }) => {
    const qrRef = useRef<HTMLDivElement>(null);

    const qrInstance = useRef(
      new QRCodeStyling({
        width: 300, // ✅ improved size
        height: 300,
        data: value,
        image: logoImage,
        dotsOptions: {
          color: "#1a1a1a", // ✅ more contrast
          type: "rounded",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 0,
          imageSize: 0.5, // ✅ slightly bigger
          hideBackgroundDots: true, // ✅ clears dots behind logo
        },
      })
    );

    useEffect(() => {
      qrInstance.current.update({
        data: value,
        image: logoImage,
      });
    
      if (qrRef.current) {
        qrRef.current.innerHTML = "";
        qrInstance.current.append(qrRef.current);
    
        // Fix: Manually apply CSS to the canvas
        const canvas = qrRef.current.querySelector("canvas");
        if (canvas) {
          canvas.style.width = "230px";
          canvas.style.height = "230px";
        }
      }
    }, [value, logoImage]);
    
    

    return (
      <div
        className="rounded-xl overflow-hidden border border-gray-200 shadow-md"
      >
        <div ref={qrRef} />
      </div>
    );
  }
);

QRCodeWithLogo.displayName = "QRCodeWithLogo";
export default QRCodeWithLogo;
