import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const onAddToCartClick = (e) => {
    e.stopPropagation();

    // ✅ SAFETY CHECK (prevents crash)
    if (typeof handleAddtoCart !== "function") {
      console.error(
        "handleAddtoCart is missing or not a function. Check parent component."
      );
      return;
    }

    handleAddtoCart(product?._id, product?.totalStock);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      {/* PRODUCT CLICK → DETAILS */}
      <div onClick={() => handleGetProductDetails?.(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />

          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>
          ) : null}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>

          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          <div className="flex justify-between">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold`}
            >
              ${product?.price}
            </span>

            {product?.salePrice > 0 && (
              <span className="text-lg font-semibold">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* ADD TO CART */}
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button disabled className="w-full">
            Out Of Stock
          </Button>
        ) : (
          <Button className="w-full" onClick={onAddToCartClick}>
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
