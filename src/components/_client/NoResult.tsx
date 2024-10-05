import { FileMinus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NoResult() {
  const t = await getTranslations("common");
  return (
    <div className="flex flex-col items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <FileMinus className="h-8 w-8 text-gray-500 dark:text-gray-400 mb-2" />
      <p className="text-gray-500 dark:text-gray-400 text-center">
        {t("noResult")}
      </p>
    </div>
  );
}
