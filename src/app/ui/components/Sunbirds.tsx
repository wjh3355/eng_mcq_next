"use client";

import Carousel from "react-bootstrap/Carousel";
import Image from "next/image";

export default function Sunbirds() {

   const sunbirdPics = ["/sb11.jpg", "/sb22.jpg", "/sb33.jpg"];

   return (
      <Carousel interval={3000} controls={false}>
         {
            sunbirdPics.map((href, idx) =>             
               <Carousel.Item key={idx}>
                  <Image
                     src={href}
                     quality={100}
                     width={1000}
                     height={600}
                     alt={`Picture of a sunbird ${idx+1}`}
                     layout="responsive"
                  />
               </Carousel.Item>
            )
         }
      </Carousel>
   );
}
