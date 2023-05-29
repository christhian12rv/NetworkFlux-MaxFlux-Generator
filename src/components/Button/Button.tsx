import './ButtonStyles.css';
import React from 'react';

type Props = {
	children: any;
	onClick: (e: any) => any;
}

export const Button: React.FunctionComponent<Props> = ({children, onClick}) => {
	return (
		<button className='main-button' onClick={onClick} >{children}</button>
	)
}