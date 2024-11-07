import Skeleton from "react-loading-skeleton";

export default function MCQLoadingUI() {
   return (
      <div className="container">
         <div className="row my-3">
            <h5 className="text-center m-0">Loading...</h5>
         </div>
         <div className="row">
            <div className="col-lg-8 col-md-7">
               <div className="card card-body mb-3">
                  <Skeleton height="24px" />
               </div>
               <Skeleton height="38px" className="mb-3"/>
            </div>
            <div className="col-lg-4 col-md-5">
               <div className="vstack gap-3">
                  <Skeleton height={47} />
                  <Skeleton height={47} />
                  <Skeleton height={47} />
                  <Skeleton height={47} />
               </div>
            </div>
         </div>
      </div>
   );
}
