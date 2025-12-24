import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice";

import {
  Airplay,
  BabyIcon,
  Briefcase,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  Sparkles,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  ShoppingBag,
  BadgeRussianRuble,
  BadgePercent,
  BadgeDollarSign,
} from "lucide-react";

/* =========================
   CATEGORIES & BRANDS
========================= */

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
  { id: "blackberrys", label: "Blackberrys", icon: Briefcase },
  { id: "snitch", label: "Snitch", icon: Sparkles },
  { id: "indian-garage", label: "The Indian Garage Co.", icon: ShoppingBag },
  { id: "raymond", label: "Raymond", icon: BadgeDollarSign },
  { id: "peter-england", label: "Peter England", icon: BadgePercent },
  { id: "calvin-klein", label: "Calvin Klein", icon: BadgeRussianRuble },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* =========================
     HANDLERS
  ========================= */

  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [item.id] }));
    navigate("/shop/listing");
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleAddtoCart = (productId) => {
    if (!user) {
      toast({ title: "Please login to add items to cart" });
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product added to cart" });
      }
    });
  };

  /* =========================
     EFFECTS
  ========================= */

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (!featureImageList?.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= CAROUSEL ================= */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList?.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt=""
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <Button
          size="icon"
          variant="outline"
          className="absolute top-1/2 left-4 -translate-y-1/2"
          onClick={() =>
            setCurrentSlide(
              (prev) =>
                (prev - 1 + featureImageList.length) % featureImageList.length
            )
          }
        >
          <ChevronLeftIcon />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length ? (
              productList.map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center">No products available</p>
            )}
          </div>
        </div>
      </section>

      {/* ================= PRODUCT DETAILS ================= */}
      {openDetailsDialog && productDetails && (
        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      )}
    </div>
  );
}

export default ShoppingHome;
