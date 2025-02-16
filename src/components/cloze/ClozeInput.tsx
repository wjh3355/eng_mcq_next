import styled from "styled-components";

const ClozeInput = styled.input<{
   $isCorrect: boolean | null
}>`
   width: 130px;
   height: 32px;
   text-align: center;
   border: 2px solid;

   border-color: ${({$isCorrect}) => $isCorrect === true ? "green" : ($isCorrect === false ? "rgb(190, 44, 44)" : "lightGray")};
   color: ${({$isCorrect}) => $isCorrect ? "green" : "default"};
   font-weight: ${({$isCorrect}) => $isCorrect ? "bold" : "default"};
`;

export default ClozeInput;