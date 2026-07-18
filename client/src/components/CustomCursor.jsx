import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPointer, setIsPointer] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let points = [];

    const onMove = (e) => {
      // magnetic snap to nearby buttons/links
      const target = e.target;
      const clickable = target.closest("a, button, [role='button'], .cursor-pointer");
      setIsPointer(!!clickable);

      if (clickable) {
        const rect = clickable.getBoundingClientRect();
        mouseX = rect.left + rect.width / 2;
        mouseY = rect.top + rect.height / 2;
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
      setHidden(false);
    };

    const animate = () => {
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      }

      points.push({ x: dotX, y: dotY });
      if (points.length > 14) points.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (points.length > 1) {
        ctx.setLineDash([4, 6]); // stitch dash pattern
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(30, 26, 22, 0.35)"; // matches ink color
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    const handleLeave = () => setHidden(true);
    const handleEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-[9998] pointer-events-none" />
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-bottle
                    transition-[width,height] duration-200 ease-out
                    ${isPointer ? "w-4 h-4" : "w-2 h-2"}
                    ${hidden ? "opacity-0" : "opacity-100"}`}
      />
    </>
  );
}