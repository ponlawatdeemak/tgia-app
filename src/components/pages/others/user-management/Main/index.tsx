import UserManagementSearchForm from './SearchForm'
import UserManagementTable from './Table'

export const UserManagementMain = () => {
	return (
		<div className='flex flex-col'>
			<UserManagementSearchForm />
			<UserManagementTable />
		</div>
	)
}
