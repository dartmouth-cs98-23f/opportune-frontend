import { motion } from "framer-motion";

interface Text {
	text: string;
}

export default function PlainText(text:Text) {
  return (
	<motion.div initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.4 }}>
		{text.text}
	</motion.div>
  )
}
