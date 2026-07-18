import React from "react";

export default function About() {
  return (
    <div>
      <section className="pt-20 pb-16">
        <div className="max-w-[1180px] mx-auto px-8 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="eyebrow">Our Story</div>
            <h1 className="text-4xl md:text-[52px] leading-[1.02] mb-6 font-display">
              We believe clothes deserve <em className="italic font-medium text-bottle">more than one life</em>.
            </h1>
            <p className="text-[16px] opacity-80 mb-4 max-w-lg">
              ReWear started as a small college project with a simple idea: good clothes shouldn't end up
              forgotten in the back of a closet, or worse, in a landfill. Every piece on ReWear has been
              worn, loved, and is ready for its next chapter.
            </p>
            <p className="text-[16px] opacity-80 max-w-lg">
              We hand-check every item for quality, price it honestly, and make sure the person buying it
              knows exactly what they're getting — no surprises, no greenwashing, just good clothes at a
              fair price.
            </p>
          </div>
          <img
            src="https://loremflickr.com/700/860/fashion,rack?lock=61"
            alt="Clothing rack"
            className="w-full aspect-[4/5] object-cover rounded-sm shadow-2xl"
          />
        </div>
      </section>

      <section className="bg-putty-light py-20">
        <div className="max-w-[1180px] mx-auto px-8 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-4xl font-display font-semibold mb-2">2,400+</div>
            <div className="text-sm opacity-65 uppercase tracking-wide">Pieces rescued</div>
          </div>
          <div>
            <div className="text-4xl font-display font-semibold mb-2">1,100+</div>
            <div className="text-sm opacity-65 uppercase tracking-wide">Happy customers</div>
          </div>
          <div>
            <div className="text-4xl font-display font-semibold mb-2">98%</div>
            <div className="text-sm opacity-65 uppercase tracking-wide">Would shop again</div>
          </div>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 py-20">
        <div className="section-head flex justify-between items-end mb-11 flex-wrap gap-5">
          <h2 className="text-[32px] md:text-[42px] font-display">What we stand for</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-3xl mb-3">♻️</div>
            <h3 className="text-xl mb-2 font-display">Sustainability first</h3>
            <p className="text-sm opacity-75">Every resale keeps a garment out of landfill and cuts down on new production.</p>
          </div>
          <div>
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-xl mb-2 font-display">Honest condition</h3>
            <p className="text-sm opacity-75">We never hide wear — every listing shows real photos and a clear condition label.</p>
          </div>
          <div>
            <div className="text-3xl mb-3">💛</div>
            <h3 className="text-xl mb-2 font-display">Fair pricing</h3>
            <p className="text-sm opacity-75">Quality secondhand fashion at a fraction of retail, for both buyer and seller.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
