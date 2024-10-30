import checkAdminUserAuth from "@/lib/checkAdminUserAuth";

export default async function Page() {
   await checkAdminUserAuth();

   return (
      <p>
         Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus cum itaque ut non officia quasi expedita, temporibus minima soluta cumque reiciendis sapiente ullam dicta, et, doloribus accusantium. Saepe, aut rem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae magnam nesciunt dignissimos doloribus delectus sapiente possimus blanditiis distinctio vitae fugit ex aspernatur quibusdam eveniet vel assumenda, autem odio mollitia laboriosam. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex quod, quos repellendus eaque corrupti nemo sit et maiores praesentium temporibus aperiam aliquam vel ipsa cupiditate magni nisi iusto dolor laborum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit voluptatum rem blanditiis sequi optio et dolores repellat, illo quos, laboriosam sapiente explicabo voluptas. Repellendus autem est aliquid! Sed, est omnis? Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio tempore et tenetur, totam iusto, fuga placeat inventore dolore a ab atque commodi nesciunt doloremque aut distinctio accusamus, illo saepe eum.
      </p>
   );
};