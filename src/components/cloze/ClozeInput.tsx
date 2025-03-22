import styled from "styled-components";

const ClozeInput = styled.input<{
   $style: "red" | "green" | "default";
}>`
   width: 130px;
   height: 32px;
   text-align: center;
   border: 2px solid lightgray;
   border-radius: 5px;
   background-color: white;
   margin: 0;
   &:disabled {
      ${({$style}) => $style === "green" && "color: green; font-weight: bold; border-color: green;"}
      ${({$style}) => $style === "red" && "color: rgb(190, 44, 44); font-weight: bold; border-color: rgb(190, 44, 44);"}
   }
`;

export default ClozeInput;