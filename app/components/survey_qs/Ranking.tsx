import { useMemo, useState } from 'react';
import styles from '~/styles/home.css';
import TeamCard from '~/components/survey_qs/TeamCard';;
import { Link } from '@remix-run/react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { motion } from 'framer-motion';

// take the question prompt
interface Ranking {
	question: string;
	teams: {id: string, name: string}[];
	prefs: {name: string, score: number}[];
}

export default function Ranking(props:Ranking) {
  const [teams, setTeams] = useState(props.teams);
  const teamIds = useMemo(() => teams.map((team) => team.id), [teams]);

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
	<div>
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
		<p>{props.question}</p>
			<div className="rank-box">
				<SortableContext items={teamIds}>
				<p> Best </p>
				{teams.map(slot => 
				 <TeamCard name={slot.name} key={slot.id} id={slot.id} class="rank-card" />
				 )}
				{teams.map((slot, idx) => 
					<input type="hidden" name={slot.name} value={idx}/>
				)}
				<p> Worst </p>
				</SortableContext>
			</div>
		</DndContext>
	</div>
  )

}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}
