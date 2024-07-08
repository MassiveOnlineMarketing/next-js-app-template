import { User } from '@prisma/client';
import { generateUUID, Website } from './Website';


jest.mock('./utils', () => ({
  generateUUID: jest.fn().mockReturnValue('12345'),
}));

describe('Website', () => {
  const user: User = {
    "id": "clv3tdoqv000010uqcdlbewnz",
    "name": "Guido",
    "email": "iguidoo@outlook.com",
    "emailVerified": new Date("2024-04-26T17:25:43.461Z"),
    "image": null,
    "password": "$2a$10$C4UX89kHGsWZduqqizRBaOGAmj2GxTzjGa7UCpz.q3rehW0U4miOC",
    "role": "USER",
    "isTwoFactorEnabled": false,
    "loginProvider": "credentials",
    "refreshToken": "1//095vrllbj889ICgYIARAAGAkSNwF-L9IrPY0WbUoUxSwTstmno_2XTbENk_IdfeiPytNDzVusaAXeqpehmgdwPldpSHtVNME749k",
    "credits": 597,
    "stripeCustomerId": null,
    "stripeSubscriptionId": null,
    "stripePriceId": null,
    "stripeCurrentPeriodEnd": null
}

  it('should create a website successfully with WebsiteConstructorParams', () => {
    const params = {
      id: 'site1',
      userId: 'user1',
      websiteName: 'Test Site',
      domainUrl: 'https://testsite.com',
    };
    const website = new Website(params);
    expect(website.id).toBe('site1');
    expect(website.userId).toBe('user1');
    expect(website.websiteName).toBe('Test Site');
    expect(website.domainUrl).toBe('https://testsite.com');
    expect(website.gscUrl).toBeNull();
    expect(website.createdAt).toBeInstanceOf(Date);
    expect(website.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a website successfully with CreateWebsiteDto and a user', () => {
    const createWebsiteDto = {
      websiteName: 'Test Site DTO',
      domainUrl: 'https://dtosite.com',
    };
    const website = new Website(createWebsiteDto, user);
    expect(website.id).toBe('12345'); // Mocked UUID
    expect(website.userId).toBe('user1');
    expect(website.websiteName).toBe('Test Site DTO');
    expect(website.domainUrl).toBe('https://dtosite.com');
    expect(website.gscUrl).toBeNull();
  });

  it('should throw an error when creating a website with CreateWebsiteDto without a user', () => {
    const createWebsiteDto = {
      websiteName: 'Test Site DTO',
      domainUrl: 'https://dtosite.com',
    };
    expect(() => new Website(createWebsiteDto)).toThrow("User must be provided when creating a website with CreateWebsiteDto or UpdateWebsiteDto");
  });

  // Add more tests as needed for other scenarios and validations
});