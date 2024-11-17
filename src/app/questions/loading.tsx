import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Skeleton from "react-loading-skeleton";
import DropdownButton from "react-bootstrap/DropdownButton";
import { BadgeInfo, BookText, CircleArrowRight } from "lucide-react";

export default function MCQLoadingUI() {
   return (
      <Container className="mb-4">
         <Row className="my-3">
            <h5 className="text-center m-0">Fetching...</h5>
         </Row>
         <Row>
            <div className="col-lg-8 col-md-7">
               <div className="card card-body mb-3">
                  <Skeleton height="24px" />
               </div>
               <div className="hstack gap-3 mb-3">
                  <DropdownButton 
                     variant="warning" 
                     disabled={true}
                     title="Score"
                     drop="end"
                  ><div/></DropdownButton>
                  <button 
                     className="border-0 bg-transparent p-0 ms-auto"
                     disabled={true}
                  >
                     <BadgeInfo size={25} strokeWidth={2}/>
                  </button>
                  <button 
                     className="border-0 bg-transparent p-0"
                     disabled={true}
                  >
                     <BookText size={25} strokeWidth={2}/>
                  </button>
                  <Button
                     variant="primary" 
                     className="d-flex align-items-center justify-content-center"
                     disabled={true}
                  >
                     <strong>Next&nbsp;</strong><CircleArrowRight size={22} strokeWidth={2}/>
                  </Button>
               </div>
            </div>
            <div className="col-lg-4 col-md-5">
               <div className="vstack gap-3">
                  <Skeleton height={47} />
                  <Skeleton height={47} />
                  <Skeleton height={47} />
                  <Skeleton height={47} />
               </div>
            </div>
         </Row>
      </Container>
   );
}
