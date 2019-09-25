const imba-logo = require('../imba-logo.png')

export tag App
	def render
		<self>
			<div.header>
				<img src=(imba-logo) width=200>
				<h1.title> "START NOW"
			<div.content>
				<p.title> "How to start"
				<p.desc> "Go to " 
					<code> "./src/client.imba"
					", open in your code editor. Try change something." 
				<p.desc> "Now, start make something."