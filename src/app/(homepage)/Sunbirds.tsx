"use client";

import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Image from "next/image";

export default function Sunbirds() {

   const sunbirdPics = ["/sb1.jpg", "/sb2.jpg", "/sb3.jpg"];

   return (
      <Container className="d-flex justify-content-center">
         <Carousel interval={5000} style={{width: "1000px"}}>
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
      </Container>
   );
}
