import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";
import React from "react";
import { Card, CardTitle, CardAccordion, CardAccordionItem, CardAccordionTrigger, CardAccordionContent } from "../Card";


const PeopleAlsoAsk = ({
  keywordData,
}: {
  keywordData: GoogleSearchLatestKeywordResult;
}) => {
  if (!keywordData.peopleAlsoAsk) {
    return null;
  }

  return (
    <Card>
      <CardTitle title='People Also Ask' />
      <CardAccordion type='multiple' >
        {keywordData.peopleAlsoAsk.map((item, index) => (
          <CardAccordionItem key={index} value={item.question} >
            <CardAccordionTrigger>{item.question}</CardAccordionTrigger>
            <CardAccordionContent>{item.snippet}</CardAccordionContent>
          </CardAccordionItem>
        ))}
      </CardAccordion>
    </Card>
  );
};

export default PeopleAlsoAsk;
