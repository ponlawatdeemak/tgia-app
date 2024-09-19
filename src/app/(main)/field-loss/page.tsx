import { FieldLossMain } from '@/components/pages/field-loss'
import React from 'react'

interface FieldLossPageProps {
	params: { lng: string }
}

const FieldLossPage: React.FC<FieldLossPageProps> = ({ params: { lng } }) => {
	return <FieldLossMain />
}

export default FieldLossPage
