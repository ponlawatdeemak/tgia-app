import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

export default function AlignItemsList() {
	const data = [
		{
			name: 'Remy Sharp',
			title: 'Brunch this weekend?',
			subTitle: 'Ali Connors',
			detail: " — I'll be in your neighborhood doing errands this…",
		},
		{
			name: 'Travis Howard',
			title: 'Summer BBQ',
			subTitle: 'to Scott, Alex, Jennifer',
			detail: " — Wish I could come, but I'm out of town this…",
		},
		{
			name: 'Cindy Baker',
			title: 'Oui Oui',
			subTitle: 'Sandra Adams',
			detail: ' — Do you have Paris recommendations? Have you ever…',
		},
		{
			name: 'Remy Sharp',
			title: 'Brunch this weekend?',
			subTitle: 'Ali Connors',
			detail: " — I'll be in your neighborhood doing errands this…",
		},
		{
			name: 'Travis Howard',
			title: 'Summer BBQ',
			subTitle: 'to Scott, Alex, Jennifer',
			detail: " — Wish I could come, but I'm out of town this…",
		},
		{
			name: 'Cindy Baker',
			title: 'Oui Oui',
			subTitle: 'Sandra Adams',
			detail: ' — Do you have Paris recommendations? Have you ever…',
		},
	]

	return (
		<List className='overflow-auto' sx={{ width: '100%', maxHeight: 216, bgcolor: 'background.paper' }}>
			{data.map((item) => {
				return (
					<>
						<ListItem alignItems='flex-start'>
							<ListItemAvatar>
								<Avatar alt={item.name} src='/static/images/avatar/1.jpg' />
							</ListItemAvatar>
							<ListItemText
								primary={item.title}
								secondary={
									<React.Fragment>
										<Typography
											sx={{ display: 'inline' }}
											component='span'
											variant='body2'
											color='text.primary'
										>
											{item.subTitle}
										</Typography>
										{item.detail}
									</React.Fragment>
								}
							/>
						</ListItem>
						<Divider variant='inset' component='li' />
					</>
				)
			})}
		</List>
	)
}
