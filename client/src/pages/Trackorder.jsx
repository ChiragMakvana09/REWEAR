import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * TrackOrder — public order-tracking page, opened by scanning the QR
 * code on the printed receipt (no login required).
 *
 * Route: add this in your router as
 *   <Route path="/track-order/:orderId" element={<TrackOrder />} />
 *
 * Expects a backend endpoint at GET /api/orders/track/:id
 * (see trackOrderController-snippet.js + trackOrderRoutes-snippet.js).
 *
 * API base URL: set VITE_API_URL in your frontend .env, e.g.
 *   VITE_API_URL=https://your-backend.onrender.com
 * Falls back to a relative "/api" path if not set (works if frontend
 * and backend share a domain, or you're proxying in dev).
 */

const API_BASE = import.meta.env.VITE_API_URL || "";

const STAGE_LABELS = {
  placed: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  "out for delivery": "Out For Delivery",
  delivered: "Delivered",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TrackOrder() {
  const { orderId } = useParams();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  const fetchOrder = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE}/api/orders/track/${orderId}`);
      if (res.status === 404) {
        setState({ loading: false, error: "not-found", data: null });
        return;
      }
      if (!res.ok) {
        setState({ loading: false, error: "server", data: null });
        return;
      }
      const data = await res.json();
      setState({ loading: false, error: null, data });
    } catch (err) {
      setState({ loading: false, error: "network", data: null });
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <div className="min-h-screen bg-[#E8E3D3]">
      {/* ---- Header band ---- */}
      <div className="bg-[#2B3A2C] px-6 py-8 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-2xl">
          <h1
            className="text-3xl text-[#F6F1E4]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700 }}
          >
            ReWear
          </h1>
          <div className="mt-2 h-[1.5px] w-9 bg-[#D9A441]" />
          <p
            className="mt-2 text-[10px] uppercase tracking-wider text-[#D9A441]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Second life, first choice
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        {state.loading && <LoadingState />}
        {!state.loading && state.error === "not-found" && <NotFoundState />}
        {!state.loading && (state.error === "server" || state.error === "network") && (
          <ErrorState onRetry={fetchOrder} />
        )}
        {!state.loading && !state.error && state.data && <OrderDetails data={state.data} />}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-40 rounded bg-[#D6D0BC]" />
      <div className="h-20 rounded-lg bg-[#F6F1E4]" />
      <div className="h-48 rounded-lg bg-[#F6F1E4]" />
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="rounded-lg bg-[#F6F1E4] px-6 py-10 text-center">
      <p
        className="text-[10px] uppercase tracking-wider text-[#B8842E]"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        Order Not Found
      </p>
      <p className="mt-3 text-[#211F1B]">
        We couldn't find an order matching this code. Double-check the link, or
        reach out to us if you think this is a mistake.
      </p>
      <Link
        to="/"
        className="mt-5 inline-block rounded-full bg-[#2B3A2C] px-5 py-2 text-sm text-[#F6F1E4]"
      >
        Back to ReWear
      </Link>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="rounded-lg bg-[#F6F1E4] px-6 py-10 text-center">
      <p
        className="text-[10px] uppercase tracking-wider text-[#B8842E]"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        Couldn't Load Order
      </p>
      <p className="mt-3 text-[#211F1B]">
        Something went wrong while fetching your order status. Check your
        connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-5 rounded-full bg-[#2B3A2C] px-5 py-2 text-sm text-[#F6F1E4]"
      >
        Try Again
      </button>
    </div>
  );
}

function OrderDetails({ data }) {
  const {
    shortId,
    status,
    isCancelled,
    placedAt,
    estimatedDelivery,
    cancelledAt,
    statusHistory,
    items,
    totalAmount,
    stageSequence,
  } = data;

  const currentIndex = stageSequence.indexOf(status);
  const historyByStage = Object.fromEntries(
    (statusHistory || []).map((h) => [h.status, h.date])
  );

  return (
    <div className="space-y-8">
      {/* ---- Order id + status chip ---- */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-[10px] uppercase tracking-wider text-[#B8842E]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Order Receipt
          </p>
          <h2
            className="mt-1 text-2xl text-[#211F1B]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700 }}
          >
            Order #{shortId}
          </h2>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 text-[11px] uppercase tracking-wide ${
            isCancelled ? "bg-[#211F1B] text-[#F6F1E4]" : "bg-[#D9A441] text-[#2B3A2C]"
          }`}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {isCancelled ? "Cancelled" : STAGE_LABELS[status] || status}
        </span>
      </div>

      {/* ---- Meta card ---- */}
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#F6F1E4] px-6 py-5 sm:grid-cols-3">
        <div>
          <p className="text-[9px] uppercase tracking-wide text-[#B8842E]" style={{ fontFamily: "'Space Mono', monospace" }}>
            Placed
          </p>
          <p className="mt-1 text-sm font-semibold text-[#211F1B]">{formatDate(placedAt)}</p>
        </div>
        {!isCancelled && estimatedDelivery && (
          <div>
            <p className="text-[9px] uppercase tracking-wide text-[#B8842E]" style={{ fontFamily: "'Space Mono', monospace" }}>
              Estimated Delivery
            </p>
            <p className="mt-1 text-sm font-semibold text-[#211F1B]">{formatDate(estimatedDelivery)}</p>
          </div>
        )}
        {isCancelled && cancelledAt && (
          <div>
            <p className="text-[9px] uppercase tracking-wide text-[#B8842E]" style={{ fontFamily: "'Space Mono', monospace" }}>
              Cancelled On
            </p>
            <p className="mt-1 text-sm font-semibold text-[#211F1B]">{formatDate(cancelledAt)}</p>
          </div>
        )}
        <div>
          <p className="text-[9px] uppercase tracking-wide text-[#B8842E]" style={{ fontFamily: "'Space Mono', monospace" }}>
            Total
          </p>
          <p className="mt-1 text-sm font-semibold text-[#211F1B]">Rs. {totalAmount}</p>
        </div>
      </div>

      {/* ---- Timeline (skip if cancelled) ---- */}
      {!isCancelled && (
        <div>
          <p
            className="text-[10px] uppercase tracking-wider text-[#B8842E]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Status
          </p>
          <div className="relative mt-4 ml-3 border-l-2 border-dashed border-[#D6D0BC] pl-8">
            {stageSequence.map((stage, i) => {
              const done = i <= currentIndex;
              const isCurrent = i === currentIndex;
              const date = historyByStage[stage];
              return (
                <div key={stage} className="relative pb-8 last:pb-0">
                  <span
                    className={`absolute -left-[41px] top-0 h-4 w-4 rounded-full border-2 ${
                      done
                        ? "border-[#2B3A2C] bg-[#2B3A2C]"
                        : "border-[#D6D0BC] bg-[#E8E3D3]"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isCurrent ? "font-bold text-[#211F1B]" : done ? "font-semibold text-[#211F1B]" : "text-[#5A584F]"
                    }`}
                  >
                    {STAGE_LABELS[stage]}
                  </p>
                  {date && <p className="text-xs text-[#5A584F]">{formatDate(date)}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- Items ---- */}
      <div>
        <p
          className="text-[10px] uppercase tracking-wider text-[#B8842E]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Items
        </p>
        <div className="mt-3 divide-y divide-dashed divide-[#D6D0BC] rounded-lg bg-[#F6F1E4] px-5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <span className="text-[#211F1B]">
                {item.title} <span className="text-[#5A584F]">× {item.quantity}</span>
              </span>
              <span className="font-semibold text-[#211F1B]">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <p
        className="pt-4 text-center text-[10px] uppercase tracking-wider text-[#5A584F]"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        Thank you for shopping preloved with ReWear
      </p>
    </div>
  );
}