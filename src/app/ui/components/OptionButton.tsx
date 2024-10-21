import styled from "styled-components";

const OptionButton = styled.button<{
   $isCorrectOption: boolean;
   $isSelected: boolean;
}>`
   width: 100%;
   padding: 10px 10%;
   font-size: 17px;
   border-width: 3px;
   display: flex;
   justify-content: center;
   background-color: white;

   &:not(:disabled):hover {
      border-color: rgb(100, 100, 100);
   }

   &:disabled {
      border-color: ${({ $isCorrectOption, $isSelected }) => 
         $isCorrectOption ? "green" : ($isSelected ? "rgb(190, 44, 44)" : "default")};
      color: ${({ $isCorrectOption, $isSelected }) => 
         $isCorrectOption ? "green" : ($isSelected ? "rgb(190, 44, 44)" : "default")};
      font-weight: ${({ $isCorrectOption, $isSelected }) => 
         ($isSelected || $isCorrectOption) ? "bold" : "default"};
   }
`

export default OptionButton;