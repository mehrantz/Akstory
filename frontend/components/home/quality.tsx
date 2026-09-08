import { benefits } from "@/data/catalog";

const images = [
  "/images/quality-print.jpg",
  "/images/quality-cover.jpg",
  "/images/quality-gift.jpg",
] as const;

export function HomeQuality() {
  return (
    <section className="quality-pillars" id="quality">
      {benefits.map((item, index) => (
        <article key={item.title}>
          <div className="pillar-visual" aria-hidden="true">
            <img src={images[index]} alt="" />
          </div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}
