'use client'
import { Button } from '@mui/material'
import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import TextField from '@mui/material/TextField'

export default function PlaygroundPage() {
	const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'))

	return (
		<main>
			<p>โครงการพัฒนาระบบเทคโนโลยี</p>
			<p>เพื่องานประกันภัยข้าวนาปี test</p>

			<TextField required label='ชื่อผู้ใช้งาน' />
			<TextField required label='รหัสผ่าน' type='password' />

			<Button variant='contained'>เข้าสู่ระบบ</Button>
		</main>
	)
}
