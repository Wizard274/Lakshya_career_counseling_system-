import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import api from "../../services/api.js";
import { formatCurrency } from "../../utils/helpers.js";

// Ensure you have VITE_STRIPE_PUBLIC_KEY in your frontend/.env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

const CheckoutForm = ({ amount, bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/student/appointments`,
      },
      redirect: "if_required", // We can handle it without full redirect for testing if we want, but return_url is safe
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await api.post("/payments/verify-payment", {
          paymentIntentId: paymentIntent.id,
          bookingId: bookingId
        });
        toast.success("Payment successful! Redirecting to OTP confirmation...");
        navigate(`/student/verify-booking/${bookingId}`);
      } catch (err) {
        toast.error("Failed to verify payment on server");
        navigate("/student/appointments");
      }
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-body">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Complete Payment</h3>
        <p style={{ color: "var(--text-muted)", fontSize: 13.5 }}>Amount due: <strong>{formatCurrency(amount / 100)}</strong></p>
      </div>
      <PaymentElement />
      <button 
        type="submit" 
        disabled={isProcessing || !stripe || !elements}
        className="btn btn-primary btn-xl w-full"
        style={{ marginTop: 24 }}
      >
        {isProcessing ? "Processing..." : `Pay ${formatCurrency(amount / 100)}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const { id } = useParams(); // bookingId
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const createIntent = async () => {
      try {
        const res = await api.post(`/payments/create-payment-intent`, { bookingId: id });
        setClientSecret(res.data.clientSecret);
        setAmount(res.data.amount);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to initiate payment");
        toast.error(err.response?.data?.message || "Failed to initiate payment");
      }
    };
    createIntent();
  }, [id]);

  return (
    <PageLayout>
      <div className="page-header">
        <div className="page-title">Session Payment ✦</div>
        <div className="page-subtitle">Securely pay for your approved career counseling session</div>
      </div>
      
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 0" }}>
        {error ? (
          <div className="notice notice-danger">{error}</div>
        ) : !clientSecret ? (
          <div className="loader-center"><div className="spinner" /></div>
        ) : (
          <div className="card">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <CheckoutForm amount={amount} bookingId={id} />
            </Elements>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Payment;
