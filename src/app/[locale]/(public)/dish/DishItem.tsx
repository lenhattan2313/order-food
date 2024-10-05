"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DishItem } from "@/context/dishContext";
import { formatCurrency } from "@/lib/currency";
import { generateSlugUrl } from "@/lib/utils";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
type Props = {
  dish: DishItem;
};

const DishItemComp = ({ dish }: Props) => {
  const tb = useTranslations("button");
  const t = useTranslations("dish");
  const router = useRouter();
  function handleOpenDetail() {
    const slug = generateSlugUrl({ name: dish.name, id: dish.id });
    router.push(`/dish/${slug}`);
  }
  return (
    <Card className="overflow-hidden dish-item">
      <div className="relative">
        <Image
          width={150}
          height={150}
          src={dish.image}
          alt={dish.name}
          onClick={handleOpenDetail}
          className="w-full h-56 object-cover"
        />
        {/* {dish.bestSeller && (
          <div className="absolute top-4 left-4 bg-yellow-400 dark:text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {t("bestSeller")}
          </div>
        )} */}
      </div>
      <CardHeader>
        <CardTitle>{dish.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {dish.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">
            {formatCurrency(dish.price)}
          </span>
          <Button>{tb("detail")}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DishItemComp;
