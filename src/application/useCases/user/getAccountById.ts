'use server'

import userRepository from "@/infrastructure/repositories/UserRepository"

export default async function getAccountById(id: string) {
  const account = userRepository.getAccountById(id)

  return account
}