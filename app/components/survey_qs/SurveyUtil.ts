import { ReactElement, useState } from 'react';

export default function SurveyUtil(questionList: ReactElement[]) {
	const [step, setStep] = useState<number>(0); 

	// previous page
	function previous() {
		if (step > 0) setStep(step - 1);
		else setStep(step);
	}

	// next page
	function next() {
		if (step < questionList.length) setStep(step + 1);
		else setStep(step);
	}

	// update progress bar
	function getProgress():number {
		return (100 / (questionList.length - 1)) * step
	}

	return {
		step, 
		stepComp: questionList[step],
		isFirstStep: step !== 0,
		isLastStep: step !== (questionList.length - 1),
		previous, next, getProgress
	}
}
