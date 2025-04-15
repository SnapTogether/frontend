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
      }
    }, [value, logoImage]);

    useImperativeHandle(ref, () => ({
      download: (filename = "qr-code") => {
        qrInstance.current.download({ name: filename, extension: "png" });
      },
    }));

    return (
      <div
        className="rounded-xl overflow-hidden border border-gray-200 shadow-md"
        style={{ width: 300, height: 300 }}
      >
        <div ref={qrRef} />
      </div>
    );
  }
);

QRCodeWithLogo.displayName = "QRCodeWithLogo";
export default QRCodeWithLogo;
