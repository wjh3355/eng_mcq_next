import checkAdminUserAuth from "@/serverFuncs/checkAdminUserAuth";

export const dynamic = 'force-dynamic';

export default async function Page() {
   await checkAdminUserAuth();

   return (
      <p>
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, quas odio! Ea hic quia ex id necessitatibus. Perspiciatis, sit ab! Quas ad dolores aspernatur iusto explicabo at repellat architecto nam.
      </p>
   );
};