import './TextArea.css';
import React from 'react';

type Props = {
	placeholder?: string | '';
	value: any;
	onChange: (e: any) => React.ChangeEventHandler<HTMLTextAreaElement> | void | undefined;
	style?: React.CSSProperties | undefined;
	rows?: number | 1;
}

export const TextArea: React.FunctionComponent<Props> = ({ placeholder, value, onChange, style, rows, }) => {
	return (
		<textarea
			className='main-textarea'
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			style={style}
			rows={rows}
		/>
	)
}