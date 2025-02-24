export type SpellingQnObj = {
   qnNum: number,
   sentence: string,
   correctAns: string,
   type: string,
   exp: string
}

export const EMPTY_SPELLING_QN_OBJ: SpellingQnObj = {
   qnNum: NaN,
   sentence: "",
   correctAns: "",
   type: "",
   exp: ""
}

export type SpellingContextValue = {
   numQnsInSet: number,
   currNum: number,
   qnObj: SpellingQnObj,
   wrongAnsArr: SpellingQnObj[],
   isLoading: boolean,
   isCorrect: boolean | null,
   thisSessionScore: [number, number],
   userPoints: number,
   hasReachedEnd: boolean,
   setInfo: [number, number],
   isRandom: boolean,
   handleAttempt: (param: boolean) => void,
   handleNextQnBtnClick: () => void,
   redoSet: () => void
}

export const EMPTY_SPELLING_CONTEXT_VALUE: SpellingContextValue = {
   numQnsInSet: NaN,
   currNum: NaN,
   qnObj: EMPTY_SPELLING_QN_OBJ,
   isLoading: true,
   isCorrect: null,
   thisSessionScore: [NaN, NaN],
   userPoints: NaN,
   wrongAnsArr: [],
   hasReachedEnd: false,
   setInfo: [NaN, NaN],
   isRandom: false,
   handleAttempt() {},
   handleNextQnBtnClick() {},
   redoSet() {}
}

export const SPELLING_SET_SIZE = 25;