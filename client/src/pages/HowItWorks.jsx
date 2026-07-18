import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import StepCard from "../components/StepCard";

export default function HowItWorks() {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    axiosInstance.get("/steps").then((res) => setSteps(res.data.steps)).catch(() => setSteps([]));
  }, []);

  return (
    <div>
      <section className="bg-bottle text-putty-light py-20">
        <div className="max-w-[1180px] mx-auto px-8 text-center">
          <div className="mono text-xs uppercase tracking-widest text-mustard mb-4">The Process</div>
          <h1 className="text-4xl md:text-5xl font-display">How ReWear Works</h1>
          <p className="opacity-70 max-w-lg mx-auto mt-4 text-sm">
            From someone's closet to yours — here's exactly what happens at every step.
          </p>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 py-20">
        <div className="grid md:grid-cols-3 gap-x-10 gap-y-16">
          {steps.map((s, i) => <StepCard key={s._id} step={s} index={i} />)}
        </div>
      </section>
    </div>
  );
}
