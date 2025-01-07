import MCQApp from "@/app/ui/MCQApp";
import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";
import { QN_CATEGORIES_DATA, QnCategory } from "@/types";

export default async function SingleQnsPage({ params }: { params: Promise<{ category: QnCategory, qnNum: number }> }) {

   const user = await checkNormalUserAuth();
   const { category, qnNum } = await params;
   const qnNumInt = Number(qnNum);
   const categoryName = QN_CATEGORIES_DATA[category].categoryName

   return <MCQApp
      qnCategory={category}
      qnNumArray={[qnNumInt]}
      userName={user.given_name!}
      title={categoryName + " - " + `Q${qnNumInt}`}
      isSetRandom={false}
      isRedo={false}
   />
}