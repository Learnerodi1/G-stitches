"use client";

import { forwardRef, useImperativeHandle } from "react";
import { usePaystackPayment } from "react-paystack";

export interface PaystackCheckoutHandle {
  open: () => void;
}

interface PaystackCheckoutProps {
  email: string;
  amount: number;
  reference: string;
  publicKey: string;
  onSuccess: (reference: { reference: string }) => void;
  onClose: () => void;
}

// This component renders nothing (returns null) — its only job is to hold
// the usePaystackPayment hook. Because it's loaded via next/dynamic with
// ssr:false in the parent page, this file's render function NEVER runs on
// the server, so react-paystack's internal `window` access never fires
// during build-time prerendering.
function PaystackCheckoutInner(
  { email, amount, reference, publicKey, onSuccess, onClose }: PaystackCheckoutProps,
  ref: React.Ref<PaystackCheckoutHandle>
) {
  const initializePayment = usePaystackPayment({
    reference,
    email,
    amount,
    publicKey,
    currency: "NGN",
  });

  useImperativeHandle(ref, () => ({
    open: () => initializePayment({ onSuccess, onClose }),
  }));

  return null;
}

export default forwardRef(PaystackCheckoutInner);