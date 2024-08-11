'use server'

import { auth } from "@/application/services/AuthService";

const UserActions = async () => {
  const session = await auth()
  console.log(session?.user);

  return (
    <div className="p-1 border-4 border-gray-200 dark:border-[rgba(223,229,250,0.02)]  rounded-md">
      <div className="h-[54px] p-[6px] border dark:bg-[rgba(223,229,250,0.02)] dark:border-[#DFE5FA]/10 rounded flex justify-center items-center">{session?.user.name}</div>
    </div>
  )
}

export default UserActions;