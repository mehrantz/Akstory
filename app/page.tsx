import { AnnouncementBar, SiteFooter } from "@/components/layout/site-chrome";
import { HomeBrand } from "@/components/home/brand";
import { HomeFaqPreview } from "@/components/home/faq-preview";
import { HomeGift } from "@/components/home/gift";
import { HomeHero } from "@/components/home/hero";
import { HomeHowPreview } from "@/components/home/how-preview";
import { HomeProductSlider } from "@/components/home/product-slider";
import { HomeQuality } from "@/components/home/quality";
import { HomeTestimonials } from "@/components/home/testimonials";

export default function Home() {
  return (
    <main className="home-page">
      <div className="glass-orbs" aria-hidden="true">
        <i className="orb orb-a" />
        <i className="orb orb-b" />
        <i className="orb orb-c" />
        <i className="orb orb-d" />
      </div>
      <div className="glass-grain" aria-hidden="true" />
      <AnnouncementBar />
      <HomeHero />
      <HomeProductSlider />
      <HomeQuality />
      <HomeHowPreview />
      <HomeBrand />
      <HomeTestimonials />
      <HomeGift />
      <HomeFaqPreview />
      <SiteFooter />
    </main>
  );
}
