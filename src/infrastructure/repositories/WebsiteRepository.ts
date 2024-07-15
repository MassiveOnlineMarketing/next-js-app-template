
import { db } from "../db/prisma";

import { Website } from "@/domain/_entities/Website";
import { IWebsiteRepository } from "@/domain/repository/IWebsiteRepository";

class WebsiteRepository implements IWebsiteRepository {
  async create(website: Website, userId: string): Promise<Website> {
    const resWebsite = await db.website.create({
      data: {
        ...website,
        userId
      }
    })

    return resWebsite;
  }

  async update(website: Website): Promise<Website> {
    const resWebsite = await db.website.update({
      where: {
        id: website.id
      },
      data: {
        ...website
      }
    })

    return resWebsite;
  }

  async delete (websiteId: string): Promise<boolean> {
    const website = await db.website.delete({
      where: {
        id: websiteId
      }
    })

    return !!website;
  }

  async getAll(): Promise<Website[]> {
    const websites = await db.website.findMany();

    return websites;
  }

  async getByUserId(userId: string): Promise<Website[]> {
    const websites = await db.website.findMany({
      where: { userId }
    })

    return websites;
  }

  async getById(websiteId: string): Promise<Website | null> {
    const website = await db.website.findUnique({
      where: { id: websiteId }
    })

    return website;
  }
}

const websiteRepository = new WebsiteRepository();

export default websiteRepository;