export type DefinitionProps = {
   qnObj: DefinitionQnObj,
   isLoading: boolean,
   setInfo: {
      numQnsInSet: number,
      currQnNum: number,
      hasReachedEnd: boolean,
   },
   userInfo: {
      userPoints: number,
      numCorrect: number,
      numAttempted: number,
      isCorrect: boolean | null,
      wrongAnsArr: DefinitionQnObj[],
   },
   callbacks: {
      handleOptionClick: (param: boolean) => void,
      handleNextQnBtnClick: () => void,
      redoSet: () => void
   }
}

export type DefinitionQnObj = {
   qnNum: number,
   definitionToTest: string,
   options: string[],
   correctAns: string,
   type: string
}

export const EMPTY_DEFINITION_QN_OBJ: DefinitionQnObj = {
   qnNum: NaN,
   definitionToTest: "",
   options: [],
   correctAns: "",
   type: ""
}

export const DEFINITION_SET_SIZE = 30;