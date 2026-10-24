import { headers } from "next/headers";
import mongoose from "mongoose";
import { auth } from "@/src/lib/auth";
// Component Imports
import UserViewApp from '@/src/views/admin/view'
import { notFound } from 'next/navigation';

async function getInitialUserById(id) {
  try {
    // 2. Validate the ID structure
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid Mongoose Object ID:", id);
      return notFound();
    }

    const response = await auth.api.getUser({
      headers: await headers(),
      query: { id: id}
    });

    return {
      user: response,
      error: null
    }
  } catch (error) {
    return {
      user: null,
      error: error.message
    }
  }
}

const UserViewPage = async ({ params }) => {
  const { id } = await params;
  const initialUser = await getInitialUserById(id)
  console.log(initialUser, "intitial user server side")
  const data = JSON.parse(JSON.stringify(initialUser))
  return <UserViewApp initialUser={data}/>
}

export default UserViewPage
