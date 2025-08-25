import { Upload } from "lucide-react";

export default function UploadButton() {
  return (
    <div className="flex flex-col items-center cursor-pointer select-none">
      <div className="p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md transition-colors">
        <Upload
          size={20}
          className="text-gray-700 dark:text-gray-200 md:w-6 md:h-6"
        />
      </div>
      <span className="mt-1 text-xs md:text-sm font-medium text-gray-400 dark:text-gray-400">
        Upload
      </span>
    </div>
  );
}
