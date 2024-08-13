'use server'

import { auth } from "@/application/services/AuthService";

const UserActions = async () => {
  const session = await auth()
  console.log(session?.user);

  return (
    <div className="p-1 border-4 border-gray-200 dark:border-dark-bg-light  rounded-md">
      <div className="h-[54px] p-[6px] border dark:bg-dark-bg-light dark:border-dark-stroke mix-blend-multiply dark:mix-blend-plus-lighter rounded flex justify-center items-center">{session?.user.name}</div>
    </div>
  )
}

export default UserActions;