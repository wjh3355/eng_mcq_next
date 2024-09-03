import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Navbar from "react-bootstrap/Navbar";

export default function AccountButton() {
   const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

   if (isLoading) {
      return (
         <div>
            <Button
               disabled
               variant="danger"
               size="sm"
               className="btn btn-danger btn-sm ms-2 align-items-center justify-content-center d-flex"
               style={{
                  width: '80px',
                  height: '30px'
               }}
            >
               <Spinner animation="border" size="sm" />
            </Button>
         </div>
      );
   }

   if (isAuthenticated) {
      return (
         <div className="d-flex align-items-center">
            <Navbar.Text>
               Welcome,&nbsp;
               <strong>{user?.given_name}</strong>
            </Navbar.Text>
            <LogoutLink
               className="btn btn-danger btn-sm ms-2 align-items-center justify-content-center d-flex"
               style={{
                  width: '80px',
                  height: '30px'
               }}
            >
               Log Out
            </LogoutLink>
         </div>
      );
   } else {
      return (
         <div>
            <LoginLink
               className="btn btn-danger btn-sm align-items-center justify-content-center d-flex"
               style={{
                  width: "80px",
                  height: "30px",
               }}
            >
               Log In
            </LoginLink>
         </div>
      );
   }
};