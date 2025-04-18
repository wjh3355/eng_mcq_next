"use client";

import { BadgeInfo, BookmarkX, BookOpenText, CalendarPlus2, ChartNoAxesCombined, ListTodo } from "lucide-react";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function Advert() {
   return (
      <>
         <Row className="mt-3">
            <Col md={6} lg={4} className="mb-3">
               <Card body className="h-100 bg-success-subtle border-0 shadow-sm">
                  <Card.Title><ListTodo /></Card.Title>
                  <Card.Subtitle className="my-3">MCQ Questions</Card.Subtitle>
                  <Card.Text className="text-muted">Over 1000 original MCQ questions across many categories</Card.Text>
               </Card>
            </Col>
            <Col md={6} lg={4} className="mb-3">
               <Card body className="h-100 bg-success-subtle border-0 shadow-sm">
                  <Card.Title><BookOpenText /></Card.Title>
                  <Card.Subtitle className="my-3">Cloze Passages</Card.Subtitle>
                  <Card.Text className="text-muted">Wide selection of vocabulary words tested</Card.Text>
               </Card>
            </Col>
            <Col md={6} lg={4} className="mb-3">
               <Card body className="h-100 bg-success-subtle border-0 shadow-sm">
                  <Card.Title><ChartNoAxesCombined /></Card.Title>
                  <Card.Subtitle className="my-3">Progress Tracking</Card.Subtitle>
                  <Card.Text className="text-muted">Keeps track of how many questions you&apos;ve attempted</Card.Text>
               </Card>
            </Col>
            <Col md={6} lg={4} className="mb-3">
               <Card body className="h-100 bg-success-subtle border-0 shadow-sm">
                  <Card.Title><BadgeInfo /></Card.Title>
                  <Card.Subtitle className="my-3">Clear Definitions</Card.Subtitle>
                  <Card.Text className="text-muted">Clear English definitions for all words</Card.Text>
               </Card>
            </Col>
            <Col md={6} lg={4} className="mb-3">
               <Card body className="h-100 bg-success-subtle border-0 shadow-sm">
                  <Card.Title><BookmarkX /></Card.Title>
                  <Card.Subtitle className="my-3">Redo Wrong Questions</Card.Subtitle>
                  <Card.Text className="text-muted">Allows you to redo wrong questions from before</Card.Text>
               </Card>
            </Col>
            <Col md={6} lg={4} className="mb-3">
               <Card body className="h-100 bg-success-subtle border-0 shadow-sm">
                  <Card.Title><CalendarPlus2 /></Card.Title>
                  <Card.Subtitle className="my-3">In Line With MOE Syllabus</Card.Subtitle>
                  <Card.Text className="text-muted">All the latest tested words, phrases and expressions</Card.Text>
               </Card>
            </Col>
         </Row>

         <Row>
            <Col>
               View our free
               <Link href="/demo/mcq" className="btn btn-outline-primary mx-1 fw-bold">
                  Demo MCQ Questions
               </Link> or
               <Link href="/demo/cloze" className="btn btn-outline-primary mx-1 fw-bold">
                  Demo Cloze Passage
               </Link>.
            </Col>
         </Row>
      </>
   );
}