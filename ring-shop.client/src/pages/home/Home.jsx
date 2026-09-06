/* eslint-disable react-hooks/refs */
import useScrollReveal from "../../hooks/useScrollReveal/useScrollReveal";
import useAuth from "../../hooks/authUser/useAuth";
import Carousel from "../../components/carousel/carousel";
import ProductsCarousel from "../../components/carousel/productsCarousel";

import imageAnnouncementMobile from "../../../public/images/image-announcement-mobile.jpeg"
import imageAnnouncement from "../../../public/images/image-announcement.jpeg";
import logo from "../../../public/images/logo.jpeg";
import lupa from "../../../public/images/lupa.png";

import ring1 from "../../.././public/rings/ring_1.png";
import ring2 from "../../.././public/rings/ring_2.png";
import ring3 from "../../.././public/rings/ring_3.jpg";
import ring4 from "../../.././public/rings/ring_4.jpg";
import single from "../../.././public/rings/single.jpg";
import necklace from "../../.././public/rings/necklace.jpg";
import banner from "../../.././public/rings/banner.jpg";
import bracelet from "../../.././public/rings/bracelet.jpg";

import "./Home.css";
import { useEffect } from "react";

export function Home() {
    const { user } = useAuth();
    const carouselReveal = useScrollReveal();
    const itemsReveal = useScrollReveal();
    const productsReveal = useScrollReveal();
    const bannerReveal = useScrollReveal();

    useEffect(() => {
        async function loadScreen() {
            if (user === null) {
                return;
            }
        }
        loadScreen();
    }, [user]);

    const images = [
        { mobile: imageAnnouncementMobile, desktop: imageAnnouncement },
        { mobile: logo, desktop: logo },
        { mobile: lupa, desktop: lupa }
    ]

    const imagesRings = [
        { mobile: ring1, desktop: ring1, description: "Coleção Brilho Eterno - Prata 950", price: 380 },
        { mobile: ring2, desktop: ring2, description: "Coleção Entrelaços - Prata 950", price: 480 },
        { mobile: ring3, desktop: ring3, description: "Par Atemporal", price: 290 },
        { mobile: ring4, desktop: ring4, description: "Coleção Relevo", price: 350 }
    ]

    const imageItems = [
        { id: "colar", item: necklace, title: "Colares" },
        { id: "solitário", item: single, title: "Solitários" },
        { id: "pulseira", item: bracelet, title: "Pulseiras"}
    ]       

    return (
        <div className="home">
            
            <div ref={carouselReveal.ref} className={`reveal ${carouselReveal.isVisible ? "visible" : ""}`}>
                <Carousel images={images}>
                    <div className="hero-copy">
                        <p>ALIANÇAS QUE CELEBRAM</p>
                        <h1>Uma promessa<br />para toda a vida</h1>
                    </div>
                </Carousel>
            </div>

            <div ref={itemsReveal.ref} className={`items reveal ${itemsReveal.isVisible ? "visible" : ""}`}>
                {imageItems.map(image => (
                    <div className="item" key={image.id}>
                        <img src={image.item} />
                        <span>{image.title}</span>
                    </div>
                )) }
            </div>
                <img src={banner} ref={bannerReveal.ref} className={`banner reveal ${bannerReveal.isVisible ? "visible" : ""}`} />

            <div ref={productsReveal.ref} className={`reveal ${productsReveal.isVisible ? "visible" : ""}`}>
            <ProductsCarousel
                    images={imagesRings}
                />
            </div>
        </div>
    );
}
