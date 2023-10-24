import { useMemo, useState } from 'react';
import styles from '~/styles/home.css';
import TeamCard from '~/components/survey_qs/TeamCard';;
import { Link } from '@remix-run/react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';

// generate list of teams and slots
const TeamList = [
	{id: "team-1", name: "Finance"},
	{id: "team-2", name: "ML/AI"},
	{id: "team-3", name: "Cybersecurity"}
]

// take the question prompt
interface Question {
	id: number;
	question: string;
}

export default function Ranking(props:Question) {
  const [teams, setTeams] = useState(TeamList);
  const teamIds = useMemo(() => teams.map((team) => team.id), [teams]);

  console.log(teams);

  function handleDragEnd(event: any) {
	const { active, over } = event;

	if (active.id !== over.id) {
		setTeams((teams) => {
			const activeIndex = teams.findIndex((team) => team.id === active.id);
			const overIndex = teams.findIndex((team) => team.id === over.id);
			return arrayMove(teams, activeIndex, overIndex);
		});
	}
  }

  return (
	<motion.div initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			    exit={{ opacity: 0 }}
				transition={{ duration: 0.4 }}>
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
		<p>{props.question}</p>
		    
			<div className="rank-box">
				<SortableContext items={teamIds}>
				<p> Best </p>
				{teams.map(slot => 
				 <TeamCard name={slot.name} key={slot.id} id={slot.id} class="rank-card" />)}
				<p> Worst </p>
				</SortableContext>
			</div>
			
		</DndContext>
	</motion.div>
  )

}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}
