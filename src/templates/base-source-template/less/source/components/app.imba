const imba-logo = require('../imba-logo.png')

export tag App
	def render
		<self>
			<div.header>
				<img src=(imba-logo) width=200>
				<h1.title> "START NOW"
			<div.content>
				<p.title> "How to start"
				<p.desc> "Open" 
					<code> "./source/components/app.imba"
					" in your code editor and try change it." 
				<p.desc> "You should see this page changed."