import React from 'react';
import './Notification.css';

const Notification = ({ messages }) => {
	if (messages.length === 0) {
		return null;
	}

	return (
		<div>
			{messages.map(msg =>
				<p key={msg.id} className={`notification-${msg.type}`}>
					{msg.content}
				</p>
			)}
		</div>

	);
};

export default Notification;