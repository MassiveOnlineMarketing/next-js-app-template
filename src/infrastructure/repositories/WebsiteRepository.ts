
import { db } from "../db/prisma";

import { Website } from "@/domain/_entities/Website";
import { IWebsiteRepository } from "@/domain/repository/IWebsiteRepository";

class WebsiteRepository implements IWebsiteRepository {
  async create(website: Website, userId: string): Promise<Website> {
    // Implement database interaction to create a new website

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

  async getAll(): Promise<Website[]> {
    // Implement database interaction to get all websites
    const websites = await db.website.findMany();

    return websites;
  }
}

const websiteRepository = new WebsiteRepository();

export default websiteRepository;