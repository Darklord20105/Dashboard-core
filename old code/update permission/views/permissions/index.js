import AdminPermissionsUpdateForm from "./admin-update-permissions-form"

const AdminPermissionsUpdate = ({initialUsers}) => {
  return (
    <div>
      <div className='mb-4 md:mb-6 lg:mb-10'>
        <h1 className='text-xl font-bold'>Granular Feature Access Engine</h1>
        <p className='text-muted-foreground'>Manually override role boundaries by injecting or removing specific permission.</p>
      </div>
      <AdminPermissionsUpdateForm initialUsers={initialUsers}/>
    </div>
  )
}

export default AdminPermissionsUpdate