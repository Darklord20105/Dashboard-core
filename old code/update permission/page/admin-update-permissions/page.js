import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import AdminPermissionsUpdate from "@/src/views/admin/permissions/index";

async function getInitialUsers() {
  try{
    const response = await auth.api.listUsers({
      headers: await headers(),
      query: { limit: 100 }
    });

    if (response && "users" in response) {
      return {
        items: response.users || [], // 👈 It is response.users, NOT response.data.users
        error: null
      };
    }

    return {
      items: [],
      error: "Could not compile user records."
    };

  } catch (error) {
    console.log('Server API Exception Error: ',error)
    return {
      items: [],
      error: error || "Unknown internal server fetch error"
    }
  }
}

const AdminPermissionsUpdatePage = async () =>  {
  let initialUsers = await getInitialUsers();
  console.log(initialUsers)
  const data = JSON.parse(JSON.stringify(initialUsers))
  return <AdminPermissionsUpdate initialUsers={data}/>
}

export default AdminPermissionsUpdatePage;