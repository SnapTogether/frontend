// components/StorageBar.tsx
interface StorageBarProps {
    used: number;
    limit: number;
  }
  
  const formatGB = (bytes: number) => {
    const gb = bytes / (1024 ** 3);
    return gb < 0.01 ? gb.toFixed(4) : gb.toFixed(2); // Show 4 decimals if tiny
  };
  
  export default function StorageBar({ used, limit }: StorageBarProps) {
    const percent = Math.min((used / limit) * 100, 100);
  
    return (
      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between text-sm text-white font-medium">
          <span>Storage</span>
          <span>{formatGB(used)}GB / {formatGB(limit)}GB</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded">
          <div
            className="h-full bg-green-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }
  