import ReactDatePicker from 'react-datepicker';
import datepicker from 'react-datepicker/dist/react-datepicker.css';
import styles from '~/styles/home.css';
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
    <div>
        <div className="field-container">
		<label htmlFor={props.classLabel}> {props.label} </label>
		<DatePicker selected={savedDate}
                    onChange={(date) => setSavedDate(date)}
                    name={props.classLabel} 
                    />
        </div>
	
	</div>
  )
}

export function links() {
    return [
      { rel: 'stylesheet', href: datepicker },
      { rel: 'stylesheet', href: styles },
    ];
  }