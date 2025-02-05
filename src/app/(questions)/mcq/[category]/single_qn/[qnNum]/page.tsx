import MCQApp from "@/components/mcq/MCQApp";
import { QN_CATEGORIES_DATA, QnCategory } from '@/definitions';
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";

export default async function SingleQnsPage({ params }: { params: Promise<{ category: QnCategory, qnNum: number }> }) {

   const user = await checkAuthForRoute();
   const { category, qnNum } = await params;
   const qnNumInt = Number(qnNum);
   const categoryName = QN_CATEGORIES_DATA[category].categoryName

   return <MCQApp
      qnCategory={category}
      qnNumArray={[qnNumInt]}
      email={user.email}
      title={categoryName + " - " + `Q${qnNumInt}`}
      isSetRandom={false}
      isRedo={false}
   />
}