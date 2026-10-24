import ProvisionUsersForm from "./create-user-form"

const ProvisionUsers = () => {
  return (
    <div>
      <div className='mb-4 md:mb-6 lg:mb-10'>
        <h1 className='text-xl font-bold'>Provision New Team Member</h1>
        <p className='text-muted-foreground'>Accounts created here will automatically receive standard default permissions matching their assigned role.</p>
      </div>
      <ProvisionUsersForm />
    </div>
  )
}

export default ProvisionUsers