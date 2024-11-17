"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { redirect, usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import { HREF_LOOKUP_MAP } from "@/types";

import shuffle from "lodash/shuffle";
import range from "lodash/range";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import createGenericMCQProvider from "@/app/ui/GenericMCQProvider";
import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";
import GenericEndScreen from "@/app/ui/components/GenericEndScreen";

import MCQLoadingUI from "../loading";

export default function Page() {
   const { user, getPermission, isLoading } = useKindeBrowserClient();
   const path = usePathname();

   if (isLoading) return <MCQLoadingUI/>;

   const match = HREF_LOOKUP_MAP[path];
   
   if (!match) notFound();
   
   const { cat, titleName, set, requiresAuth, requiresAdminAuth, isTracked } = match;

   const userName = user?.given_name || "";
   const isAdmin = getPermission("add_new_users")?.isGranted || false;

   if (
      (requiresAuth && !user) || 
      (requiresAdminAuth && !isAdmin)
   ) redirect("/api/auth/login");
      
   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategory: cat,
      qnNumArray: shuffle(range(...set.qnNumRange)),
      userName: userName,
      trackQns: isTracked
   });

   return <MCQProvider>
      <Container className="mb-4">
         <Row className="my-3">
            <Col>
               <GenericErrorContainer QnContextToUse={useMCQContext}/>
               <h5 className="text-center m-0">
                  { cat === "debug" ? "DEBUG" : (cat === "demo" ? "Demo Questions" : titleName + " - " + set.name) }
               </h5>
            </Col>
         </Row>
         <Row>
            <GenericLeftColumn QnContextToUse={useMCQContext}/>
            <GenericRightColumn QnContextToUse={useMCQContext}/>
            <GenericEndScreen QnContextToUse={useMCQContext}/>
         </Row>
      </Container>
   </MCQProvider>;
}