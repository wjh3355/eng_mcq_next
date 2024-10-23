import Skeleton from "react-loading-skeleton";

export default function Loading() {
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
               <div className="mb-2">
                  <div className="btn-group w-100">
                     <button className="btn btn-primary disabled">
                        Score & Review
                     </button>
                     <button className="btn btn-secondary disabled">
                        Explanation
                     </button>
                     <button className="btn btn-success disabled">
                        Next Question
                     </button>
                  </div>
               </div>
            </div>
            <div className="col-lg-4 col-md-5 mt-2 mt-md-0">
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
