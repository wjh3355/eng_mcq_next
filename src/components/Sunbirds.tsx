"use client";

import Image from "next/image";
import Carousel from "react-bootstrap/Carousel";
import pic1 from "../../public/A.jpg"
import pic2 from "../../public/B.jpg";
import pic3 from "../../public/C.jpg";

export default function Sunbirds() {
   const birdPics = [pic1, pic2, pic3];
   return (
      <Carousel interval={3000} controls={false}>
         {birdPics.map((href, idx) =>             
            <Carousel.Item key={idx}>
               <Image
                  src={href}
                  alt={`Picture of a bird ${idx+1}`}
                  sizes="100wv"
                  style={{
                     width: '100%',
                     height: 'auto',
                  }}
               />
            </Carousel.Item>
         )}
      </Carousel>
   );
}
