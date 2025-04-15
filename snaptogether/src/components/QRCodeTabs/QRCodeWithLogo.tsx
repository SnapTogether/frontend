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
        width: 300,
        height: 300,
        data: value,
        image: logoImage,
        dotsOptions: {
          color: "#1a1a1a",
          type: "rounded",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 0,
          imageSize: 0.5,
          hideBackgroundDots: true,
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

        const canvas = qrRef.current.querySelector("canvas");
        if (canvas) {
          canvas.style.width = "230px";
          canvas.style.height = "230px";
        }
      }
    }, [value, logoImage]);

    // ✅ Expose download() method to parent via ref
    useImperativeHandle(ref, () => ({
      download: (filename = "qr-code") => {
        qrInstance.current.download({
          name: filename,
          extension: "png",
        });
      },
    }));

    return (
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
        <div ref={qrRef} />
      </div>
    );
  }
);

QRCodeWithLogo.displayName = "QRCodeWithLogo";
export default QRCodeWithLogo;
