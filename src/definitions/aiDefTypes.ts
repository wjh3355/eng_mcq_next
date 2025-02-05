export type AIDefinition = {
   wordToDefine: string | null,
   definitions: {
      type: string,
      def: string,
      sentence: string
   }[],
   errorIfAny: string | null
};