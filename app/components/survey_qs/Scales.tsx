import styles from '~/styles/home.css';
import { Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Scale from './Scale';

type ScaleArray = React.ComponentType<Scale>[];
interface Question {
	scales: ScaleArray;
} 

export default function Scales(props:Question) {
  return (
	<div>
		Scales
	</div>
  )
}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}