import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';

import { Links } from './../api/links';
import LinksListItem from './LinksListItem';

export default class LinksList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			links: [],
			showVisible: true
		}
	}
	componentDidMount() {
		this.linksTracker = Tracker.autorun(() => {
			console.log(this.state.showVisible)
			Meteor.subscribe('links');
			const links = Links.find({
				visible: this.state.showVisible
			}).fetch();
			this.setState({ links });
		})
	}

	componentWillUnmount() {
		this.linksTracker.stop();
	}
	renderLinksListItems() {
		return this.state.links.map((link) => {
			const shortUrl = Meteor.absoluteUrl(link._id);
			return <LinksListItem key={link._id} shortUrl={shortUrl} {...link} />
		})
	}
	hide() {
		console.log(this.state.showVisible)
		if (this.refs.showHide.checked) {
			this.setState({
				showVisible: false
			})
		} else {
			this.setState({
				showVisible: true
			})	
		}
	}
	render() {
		return (
			<div>
				<p>Links List</p>
				<input onChange={this.hide.bind(this)} ref="showHide" type="checkbox"/>{this.state.showVisible ? 'Show Hidden Items' : 'Show non Hidden Items'}
				<div>
					{this.renderLinksListItems()}
				</div>
			</div>
		);
	}
}