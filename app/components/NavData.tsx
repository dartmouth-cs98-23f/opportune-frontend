import { Link } from '@remix-run/react';
import { UserCircleIcon, UserGroupIcon, 
	     FireIcon, PaperAirplaneIcon, RectangleStackIcon} from '@heroicons/react/24/outline'

export const NavData = [
	{
		title: "Basic Info",
		icon: <UserCircleIcon />,
		link: "/profile",
		class: "pointer"
	},
	{
		title: "Available teams",
		icon: <UserGroupIcon />,
		link: "/teams",
		class: "pointer"
	},
	{
		title: "Matching",
		icon: <FireIcon />,
		link: "/matching",
		class: "pointer"
	},
	{
		title: "Results",
		icon: <PaperAirplaneIcon />,
		link: "/results",
		class: "pointer"
	},
	{
		title: "Project",
		icon: <RectangleStackIcon />,
		link: "/project",
		class: "pointer icon-locked"
	},
]
