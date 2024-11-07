import styled from "styled-components";

const OptionButton = styled.button<{
   $isRed: boolean;
   $isGreen: boolean;
   $isBolded: boolean;
}>`
   width: 100%;
   padding: 10px 10%;
   font-size: 17px;
   border-width: 3px;
   display: flex;
   justify-content: center;
   align-items: center;
   background-color: white;
   position: relative;
   
   border-color: ${({ $isRed, $isGreen }) => 
      $isGreen ? "green" : ($isRed ? "rgb(190, 44, 44)" : "default")};
   color: ${({ $isRed, $isGreen }) => 
      $isGreen ? "green" : ($isRed ? "rgb(190, 44, 44)" : "default")};
   font-weight: ${({ $isBolded }) => $isBolded ? "bold" : "default"};

   &:not(:disabled):hover {
      border-color: rgb(100, 100, 100);
   }

`

export default OptionButton;