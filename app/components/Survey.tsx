import 'survey-core/defaultV2.min.css';
import pkg1 from 'survey-react-ui';
import pkg2 from 'survey-core';
const { Survey } = pkg1;
const { Model } = pkg2;

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/darkly/bootstrap.min.css" integrity="sha384-nNK9n28pDUDDgIiIqZ/MiyO3F4/9vsMtReZK39klb/MtkZI3/LtjSjlmyVPS3KdN" crossorigin="anonymous"></link>

const surveyJson = {
	"title": "Team Matching Survey",
	"description": "Start your internship off in the team of best opportunity",
	"completedHtml": "<h3>Thank you for your feedback</h3>",
	"completedHtmlOnCondition": [
	 {
	  "expression": "{nps_score} >= 9",
	  "html": "<h3>Thank you for your feedback</h3> <h4>We are glad that you love our product. Your ideas and suggestions will help us make it even better.</h4>"
	 },
	 {
	  "expression": "{nps_score} >= 6  and {nps_score} <= 8",
	  "html": "<h3>Thank you for your feedback</h3> <h4>We are glad that you shared your ideas with us. They will help us make our product better.</h4>"
	 }
	],
	"pages": [
	 {
	  "name": "page1",
	  "elements": [
	   {
		"type": "rating",
		"name": "nps_score",
		"title": "React",
		"isRequired": true
	   },
	   {
		"type": "rating",
		"name": "question1",
		"title": "Machine Learning",
		"isRequired": true
	   },
	   {
		"type": "ranking",
		"name": "question2",
		"title": "Teams",
		"isRequired": true,
		"choices": [
		 {
		  "value": "Item 1",
		  "text": "Cybersecurity"
		 },
		 {
		  "value": "Item 2",
		  "text": "Full-Stack"
		 },
		 {
		  "value": "Item 3",
		  "text": "Finance"
		 },
		 {
		  "value": "Item 4",
		  "text": "Marketing"
		 }
		]
	   },
	   {
		"type": "comment",
		"name": "disappointing_experience",
		"visibleIf": "{nps_score} <= 6",
		"title": "What compelled you to place your top choice team?"
	   }
	  ],
	  "title": "Tech Stacks",
	  "description": "Question 1"
	 }
	],
	"showQuestionNumbers": "off"
   }

export default function Surv() {
	const model = new Model(surveyJson);
	return <Survey model={model} />
}
