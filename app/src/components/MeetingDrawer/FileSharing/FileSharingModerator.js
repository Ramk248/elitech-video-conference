import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRoomContext } from '../../../RoomContext';
import { withStyles } from '@material-ui/core/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import { permissions } from '../../../permissions';
import { makePermissionSelector } from '../../Selectors';
import Button from '@material-ui/core/Button';

const styles = (theme) =>
	({
		root :
		{
			display         : 'flex',
			padding         : theme.spacing(1),
			boxShadow       : '0 2px 5px 2px rgba(0, 0, 0, 0.2)',
			backgroundColor : 'rgba(255, 255, 255, 1)'
		},
		listheader :
		{
			padding    : theme.spacing(1),
			fontWeight : 'bolder'
		},
		actionButton :
		{
			marginLeft : 'auto'
		}
	});

const FileSharingModerator = (props) =>
{
	const intl = useIntl();

	const {
		roomClient,
		isFileSharingModerator,
		room,
		classes
	} = props;

	if (!isFileSharingModerator)
		return null;

	return (
		<ul className={classes.root}>
			<li className={classes.listheader}>
				<FormattedMessage
					id='room.moderatoractions'
					defaultMessage='Moderator actions'
				/>
			</li>
			<Button
				aria-label={intl.formatMessage({
					id             : 'room.clearFileSharing',
					defaultMessage : 'Clear files'
				})}
				className={classes.actionButton}
				variant='contained'
				color='secondary'
				disabled={room.clearFileSharingInProgress}
				onClick={() => roomClient.clearFileSharing()}
			>
				<FormattedMessage
					id='room.clearFileSharing'
					defaultMessage='Clear files'
				/>
			</Button>
		</ul>
	);
};

FileSharingModerator.propTypes =
{
	roomClient             : PropTypes.any.isRequired,
	isFileSharingModerator : PropTypes.bool,
	room                   : PropTypes.object,
	classes                : PropTypes.object.isRequired
};

const makeMapStateToProps = () =>
{
	const hasPermission = makePermissionSelector(permissions.MODERATE_FILES);

	const mapStateToProps = (state) =>
		({
			isFileSharingModerator : hasPermission(state),
			room                   : state.room
		});

	return mapStateToProps;
};

export default withRoomContext(connect(
	makeMapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room === next.room &&
				prev.me === next.me &&
				prev.peers === next.peers
			);
		}
	}
)(withStyles(styles)(FileSharingModerator)));
