import UserManagementForm, { UserManagementProps } from '@/components/shared/UserManagementForm'

export const FormMain: React.FC<UserManagementProps> = ({ ...props }) => {
	return (
		<div className='flex flex-col'>
			<UserManagementForm {...props} />
		</div>
	)
}
