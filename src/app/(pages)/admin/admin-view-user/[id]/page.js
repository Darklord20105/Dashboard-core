import UserViewApp from '@/views/admin/view'

const UserViewPage = async ({ params }) => {
  const { id } = await params;
  return <UserViewApp id={id} />
}

export default UserViewPage
