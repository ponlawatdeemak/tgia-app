import UserManagementSearchForm from './components/SearchForm'
import UserManagementTable from './components/Table'

const UserManagementMain = () => {
	return (
		<div className='flex flex-col'>
			<UserManagementSearchForm />
			<UserManagementTable />
		</div>
	)
}

export default UserManagementMain
