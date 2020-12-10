import React from "react";
import Container from '@material-ui/core/Container';

function Para(props) {
	return (
		<Container
			textAlign='center'
			text
			style={{ maxWidth: "60%", margin: "auto", overflow: "auto" }}
		>
			<span className='txt'>{props.text}</span>
		</Container>
	);
}

export default Para;