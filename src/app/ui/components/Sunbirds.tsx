"use client";

import Carousel from "react-bootstrap/Carousel";

export default function Sunbirds() {

   const birdPics = ["/sb11.jpg", "/sb22.jpg", "/sb33.jpg"];

   return (
      <Carousel interval={3000} controls={false}>
         {
            birdPics.map((href, idx) =>             
               <Carousel.Item key={idx} className="mx-auto">
                  <img
                     // srcSet={`${href} 500w, ${href} 1000w, ${href} 1500w, ${href} 2000w`}
                     src={href}
                     alt={`Picture of a bird ${idx+1}`}
                     // sizes="(max-width: 576px) 500px,
                     //    (max-width: 768px) 1000px,
                     //    (max-width: 992px) 1500px,
                     //    (max-width: 1200px) 2000px,
                     //    2000px 
                     // "
                     style={{ width: "50%", height: "auto" }}
                  />
               </Carousel.Item>
            )
         }
      </Carousel>
   );
}
