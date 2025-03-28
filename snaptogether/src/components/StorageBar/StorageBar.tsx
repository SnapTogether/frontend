import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface StorageBarProps {
  used: number;
  limit: number;
}

const formatGB = (bytes: number) => {
  const gb = bytes / (1024 ** 3);
  return gb < 0.01 ? gb.toFixed(4) : gb.toFixed(2);
};

export default function StorageBar({ used, limit }: StorageBarProps) {
  const t = useTranslations("StorageBar");

  const percent = Math.min((used / limit) * 100, 100);
  const isLimitReached = used >= limit;
  const isHalfUsed = used >= limit / 2 && !isLimitReached;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-sm text-white font-medium">
        <span className="mr-1">{t("label")}</span>
        <span>
          {formatGB(used)}GB / {formatGB(limit)}GB
          <span className="ml-1">({percent.toFixed(1)}%)</span>
        </span>
      </div>

      <div className="w-full h-2 bg-gray-700 rounded">
        <div
          className={`h-full ${isLimitReached ? "bg-red-500" : "bg-green-500"} rounded`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {isLimitReached && (
        <div className="flex items-center gap-2 text-red-500 text-sm font-medium mt-1">
          <AlertTriangle size={16} />
          {t("limitReached")}
        </div>
      )}
      {isHalfUsed && (
        <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium mt-1">
          <AlertTriangle size={16} />
          {t("halfUsed")}
        </div>
      )}
    </div>
  );
}
