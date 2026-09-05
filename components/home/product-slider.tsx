"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { sliderProducts, type SliderProduct } from "@/data/catalog";

function BookVisual({ item }: { item: SliderProduct }) {
  if (item.visual === "open") {
    return (
      <div className="slide-visual open" aria-hidden="true">
        <div className="open-book">
          <div className="open-page">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="open-page">
            {item.image ? (
              <img src={item.image} alt="" className="open-page-image" />
            ) : (
              <>
                <i />
                <i />
                <i />
                <i />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-visual" aria-hidden="true">
      <div className="closed-book" style={{ background: item.cover }}>
        <span className="closed-spine" style={{ background: item.accent }} />
        <div className="closed-face">
          {item.image && <img src={item.image} alt={item.coverTitle} className="book-cover-image" />}
          <div className="book-cover-text" style={{ textShadow: item.image ? "0 2px 4px rgba(0,0,0,0.5)" : "none", color: item.image ? "#fff" : "inherit" }}>
            <small>{item.coverMeta}</small>
            <b>{item.coverTitle}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeProductSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    direction: "rtl",
    slidesToScroll: 1,
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="product-slider" aria-label="کتاب‌های عکس شخصی">
      <div className="slider-viewport" ref={emblaRef}>
        <div className="slider-track">
          {sliderProducts.map((item) => (
            <article className="product-slide" key={item.id}>
              <div className="slide-card">
                <div className="slide-top">
                  <span>{item.series}</span>
                  {item.badge ? <em>{item.badge}</em> : null}
                </div>
                <BookVisual item={item} />
                <div className="slide-meta">
                  <div className="slide-info">
                    <div className="slide-rating">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={12} />
                      ))}
                      <span>({item.reviews})</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.tagline}</p>
                  </div>
                  <div className="slide-price">
                    <small>از</small>
                    <strong>{item.price} تومان</strong>
                  </div>
                </div>
                <Link className="slide-cta" href={`/create?template=${item.templateId}`}>
                  شروع طراحی
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="slider-controls">
        <div className="slider-dots" role="tablist" aria-label="اسلایدها">
          {snaps.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-label={`اسلاید ${index + 1}`}
              aria-selected={selected === index}
              className={selected === index ? "active" : ""}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
        <div className="slider-arrows">
          <button type="button" aria-label="اسلاید قبلی" onClick={() => emblaApi?.scrollPrev()}>
            <ChevronRight size={18} />
          </button>
          <button type="button" aria-label="اسلاید بعدی" onClick={() => emblaApi?.scrollNext()}>
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
