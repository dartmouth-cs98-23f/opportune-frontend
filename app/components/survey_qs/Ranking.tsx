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
	teams: {name: string, score: number, _id: string}[];
	favoriteTeams: string[];
}

export default function Ranking(props:Ranking) {
  const [teams, setTeams] = useState(props.teams);
  const teamIds = useMemo(() => teams.map((team) => team._id), [teams]);
  const favoriteTeams = useState(props.favoriteTeams);
  console.log("Fav teams: ", favoriteTeams);
  console.log("Teams: ", teams);

  function handleDragEnd(event: any) {
	const { active, over } = event;

	if (active.id !== over.id) {
		console.log(active.id, over.id)
		setTeams((teams) => {
			const activeIndex = teams.findIndex((team) => team._id === active.id);
			const overIndex = teams.findIndex((team) => team._id === over.id);
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
				  <TeamCard name={slot.name} key={slot._id} id={slot._id} class="rank-card" favorited={favoriteTeams[0].includes(slot.name)}/>
				)}
				{teams.map((slot, idx) => 
				  <input type="hidden" name={slot.name} value={teams.length - idx}/>
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
