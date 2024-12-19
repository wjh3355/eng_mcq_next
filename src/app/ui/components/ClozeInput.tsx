import styled, { css, keyframes } from "styled-components";

const inputAnim = keyframes`
   0% { transform: scale(1); }
   50% { transform: scale(1.1); }
   100% { transform: scale(1); }
`;

const ClozeInput = styled.input<{
   $animate: boolean,
   $isCorrect: boolean | null
}>`
   width: 130px;
   height: 32px;
   text-align: center;
   border: 2px solid;

   border-color: ${({$isCorrect}) => $isCorrect === true ? "green" : ($isCorrect === false ? "rgb(190, 44, 44)" : "lightGray")};
   color: ${({$isCorrect}) => $isCorrect ? "green" : "default"};
   font-weight: ${({$isCorrect}) => $isCorrect ? "bold" : "default"};

   ${(props) =>
      props.$animate && css`animation: ${inputAnim} 400ms infinite;`
   }
`;

export default ClozeInput;