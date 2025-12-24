import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse PayPal return query params
  const params = new URLSearchParams(location.search);

  // PayPal REST / fallback tokens
  const paymentId =
    params.get("paymentId") || params.get("paymentID") || params.get("token");

  const payerId =
    params.get("PayerID") || params.get("payerID") || params.get("PayerId");

  useEffect(() => {
    // Read INTERNAL order id from localStorage (must exist)
    const orderId =
      params.get("orderId") || localStorage.getItem("currentOrderId");

    console.log("PayPal return params:", Object.fromEntries(params.entries()));
    console.log("paymentId:", paymentId, "payerId:", payerId);
    console.log("orderId from localStorage:", orderId);

    // 🔒 HARD BLOCK — required by your backend
    if (!paymentId || !payerId || !orderId) {
      alert("⚠️ Invalid or expired payment session. Please try again.");
      navigate("/shop/cart");
      return;
    }

    // Capture payment
    dispatch(capturePayment({ paymentId, payerId, orderId }))
      .unwrap()
      .then((data) => {
        if (data?.success) {
          // Clean up and redirect
          localStorage.removeItem("currentOrderId");
          navigate("/shop/payment-success");
        } else {
          alert("❌ Payment failed. Please try again.");
          navigate("/shop/cart");
        }
      })
      .catch((error) => {
        console.error("Payment capture failed:", error);
        alert("❌ Something went wrong while confirming payment.");
        navigate("/shop/cart");
      });
  }, [dispatch, navigate, paymentId, payerId, location.search]);

  return (
    <Card className="max-w-md mx-auto mt-16">
      <CardHeader>
        <CardTitle>Processing Payment… Please wait</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
