import { GenericMCQContextValueType } from "@/lib/data";

export default function GenericQnTitle({
   QnContextToUse,
}: {
   QnContextToUse: () => GenericMCQContextValueType;
}) {

   const { qnCategoryTitleName, qnSetName } = QnContextToUse();

   return (
      <h4 className="text-center m-0">
         {qnCategoryTitleName}: {qnSetName}
      </h4>
   );
};