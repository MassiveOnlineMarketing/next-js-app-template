'use server'

import userRepository from "@/infrastructure/repositories/UserRepository"

export default async function getAccountById(id: string) {
  console.log('getAccountById')

  const account = userRepository.getAccountById(id)

  return account
}