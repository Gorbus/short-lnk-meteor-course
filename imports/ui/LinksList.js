import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import FlipMove from 'react-flip-move';

import { Links } from './../api/links';
import LinksListItem from './LinksListItem';
import LinksListFilters from './LinksListFilters';


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
			Meteor.subscribe('links');
			const links = Links.find(
				{visible: Session.get('showVisible')}
				).fetch();
			this.setState({ links });
		})
	}

	componentWillUnmount() {
		this.linksTracker.stop();
	}
	renderLinksListItems() {
		if (this.state.links.length === 0) {
			return (
				<div className='item'>
					<p className="item__status-message">No Links found</p>				
				</div>
			)
		}
		return this.state.links.map((link) => {
			const shortUrl = Meteor.absoluteUrl(link._id);
			return <LinksListItem key={link._id} shortUrl={shortUrl} {...link} />
		})
	}
	Hide() {
		console.log(this.s)
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
				<div>
					<FlipMove maintainContainerHeight={true}>
						{this.renderLinksListItems()}
					</FlipMove>
				</div>
			</div>
		);
	}
}