import React from 'react';

const toast = () => (
	<div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-autohide="false">
		<div class="toast-header">
			<strong class="mr-auto">Bootstrap</strong>
			<small>11 mins ago</small>
			<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<div class="toast-body">Hello, world! This is a toast message.</div>
	</div>
);

export default toast;
