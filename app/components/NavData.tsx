import { Link } from '@remix-run/react';
import React from 'react'; 
import { Squares2X2Icon, UserCircleIcon, CalendarDaysIcon,
         UserGroupIcon, ArrowLeftOnRectangleIcon, FireIcon } from '@heroicons/react/24/outline'

export const NavData = [
	{
		title: "Dashboard",
		icon: <Squares2X2Icon />,
		link: "/dashboard"
	},
	{
		title: "Profile",
		icon: <UserCircleIcon />,
		link: "/profile"
	},
	{
		title: "Teams",
		icon: <UserGroupIcon />,
		link: "/teams"
	},
	{
		title: "Matching",
		icon: <FireIcon />,
		link: "/matching"
	},
	{
		title: "Events",
		icon: <CalendarDaysIcon />,
		link: "/events"
	},
	{
		title: "Logout",
		icon: <ArrowLeftOnRectangleIcon />,
		link: "/login"
	},
]
