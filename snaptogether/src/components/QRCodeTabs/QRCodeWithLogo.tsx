// QRCodeWithLogo.tsx
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import QRCodeStyling from "qr-code-styling";

export interface QRCodeWithLogoProps {
  value: string;
  logoImage?: string;
}

export interface QRCodeWithLogoRef {
  download: (filename?: string) => void;
}

const QRCodeWithLogo = forwardRef<QRCodeWithLogoRef, QRCodeWithLogoProps>(
  ({ value, logoImage }, ref) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const qrInstance = useRef(
      new QRCodeStyling({
        width: 200,
        height: 200,
        data: value,
        image: logoImage,
        dotsOptions: {
          color: "#000",
          type: "rounded",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 0, // less margin = larger logo
            imageSize: 0.45 // logo takes up 35% of the QR code width
          },          
      })
    );

    // Update QR code on props change
    useEffect(() => {
      qrInstance.current.update({
        data: value,
        image: logoImage,
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = "";
        qrInstance.current.append(qrRef.current);
      }
    }, [value, logoImage]);

    // Expose download method via ref
    useImperativeHandle(ref, () => ({
      download: (filename = "qr-code") => {
        qrInstance.current.download({ name: filename, extension: "png" });
      },
    }));

    return (
        <div
          className="rounded-xl overflow-hidden border border-gray-200 shadow-md"
          style={{ width: 200, height: 200 }}
        >
          <div ref={qrRef} />
        </div>
      );
        }
);

QRCodeWithLogo.displayName = "QRCodeWithLogo";

export default QRCodeWithLogo;
