import ReactDatePicker from 'react-datepicker';
import { parseDate } from '~/lib/date';
import { useState } from 'react';

// @ts-expect-error
const DatePicker = ReactDatePicker.default;

interface Field {
	label: string;
	classLabel: string;
	value: any;
}

export default function DateField(props:Field) {

  const [savedDate, setSavedDate] = useState(props.value ? parseDate(props.value) : null);

  return (
    <div className="field-container">
        <label htmlFor={props.classLabel} style={{marginRight: '5px'}}> {props.label} </label>
        <DatePicker selected={savedDate}
                    onChange={(date) => setSavedDate(date)}
                    name={props.classLabel} 
                    />
    </div>
  )
}