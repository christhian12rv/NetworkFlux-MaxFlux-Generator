import './InputStyles.css';
import React from 'react';

type Props = {
	type: string;
	placeholder?: string | '';
	value: any;
	onChange: (e: any) => React.ChangeEventHandler<HTMLTextAreaElement> | void | undefined;
}

export const Input: React.FunctionComponent<Props> = ({ type, value, onChange, placeholder }) => {
	return (
    <div>
      <input className='main-input' type={type} value={value} onChange={onChange} placeholder={placeholder || ''} />
    </div>
  );
}