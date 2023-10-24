import { Link } from '@remix-run/react';
import { UserCircleIcon, UserGroupIcon, 
	     FireIcon, PaperAirplaneIcon, RectangleStackIcon} from '@heroicons/react/24/outline'

export const NavData = [
	{
		title: "Basic Info",
		icon: <UserCircleIcon />,
		link: "/profile",
		class: null
	},
	{
		title: "Available teams",
		icon: <UserGroupIcon />,
		link: "/teams",
		class: null
	},
	{
		title: "Matching",
		icon: <FireIcon />,
		link: "/matching",
		class: null
	},
	{
		title: "Results",
		icon: <PaperAirplaneIcon />,
		link: "/results",
		class: null
	},
	{
		title: "Project",
		icon: <RectangleStackIcon />,
		link: "",
		class: "icon-locked"
	},
]
