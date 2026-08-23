import useScrollReveal from "../../hooks/useScrollReveal/useScrollReveal"
import Carousel from "../../components/carousel/carousel";
import ProductsCarousel from "../../components/carousel/productsCarousel";

import imageAnnouncementMobile from "../../../public/images/image-announcement-mobile.jpeg"
import imageAnnouncement from "../../../public/images/image-announcement.jpeg"
import logo from "../../../public/images/logo.jpeg";
import searchButton from "../../../public/images/lupa.png";

export function Home() {
    const { ref, isVisible } = useScrollReveal();

    const images = [
        { mobile: imageAnnouncementMobile, desktop: imageAnnouncement },
        { mobile: logo, desktop: logo },
        { mobile: searchButton, desktop: searchButton }
    ]
    return (
        <div ref={ref} className={`reveal ${isVisible ? "visible" : ""}`}>
            <Carousel
                images={images}
            />

            <ProductsCarousel
                images={images}
            />
        </div>
  );
}