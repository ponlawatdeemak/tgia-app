import * as React from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link'

const Link: React.FC<MuiLinkProps & NextLinkProps> = ({ component, href, ...props }) => (
	<MuiLink component={NextLink} href={href} {...props} />
)

export default Link
