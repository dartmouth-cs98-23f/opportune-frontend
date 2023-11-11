// import { motion } from "framer-motion";

interface Text {
	text: string;
}

export default function PlainText(text:Text) {
  return (
	<div>
		<p> {text.text} </p>
	</div>
  )
}
