import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./productsCarousel.css"

export default function ProductsCarousel({images}) {
    const carousel = useRef();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(carousel.current?.scrollWidth - carousel.current.offsetWidth)
    }, []);

  return (
      <motion.div ref={carousel} className="carousel" whileTap={{cursor: "grabbing"}}>
          <motion.div
              className="carousel-inner"
              drag="x"
              dragConstrains={{right: 0, left: -width} }
          >
              {images.map((image, index) => (
                  <motion.div className="item" key={index}>
                      <img src={image}/>
                  </motion.div>
              )) }
          </motion.div>
      </motion.div>
  );
}