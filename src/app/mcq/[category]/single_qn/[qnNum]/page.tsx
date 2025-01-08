import MCQApp from "@/components/mcq/MCQApp";
import getUserDataHeaders from "@/utils/getUserDataHeaders";
import { QN_CATEGORIES_DATA, QnCategory } from "@/types";

export default async function SingleQnsPage({ params }: { params: Promise<{ category: QnCategory, qnNum: number }> }) {

   const { kindeUserGivenName } = await getUserDataHeaders();
   const { category, qnNum } = await params;
   const qnNumInt = Number(qnNum);
   const categoryName = QN_CATEGORIES_DATA[category].categoryName

   return <MCQApp
      qnCategory={category}
      qnNumArray={[qnNumInt]}
      userName={kindeUserGivenName}
      title={categoryName + " - " + `Q${qnNumInt}`}
      isSetRandom={false}
      isRedo={false}
   />
}