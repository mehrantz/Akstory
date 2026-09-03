import { benefits } from "@/data/catalog";

const visuals = ["print", "cover", "gift"] as const;

export function HomeQuality() {
  return (
    <section className="quality-pillars" id="quality">
      {benefits.map((item, index) => (
        <article key={item.title}>
          <div className={`pillar-visual ${visuals[index]}`} aria-hidden="true">
            <span />
          </div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}
