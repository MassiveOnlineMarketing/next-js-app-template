import { UserRole } from "@prisma/client";


export class User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  loginProvider: string | null;
  refreshToken: string | null;
  credits: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: Date | null;

  constructor(
    id: string,
    name: string | null,
    email: string | null,
    emailVerified: Date | null,
    image: string | null,
    password: string | null,
    role: UserRole,
    isTwoFactorEnabled: boolean,
    loginProvider: string | null,
    refreshToken: string | null,
    credits: number,
    stripeCustomerId: string | null,
    stripeSubscriptionId: string | null,
    stripePriceId: string | null,
    stripeCurrentPeriodEnd: Date | null
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.emailVerified = emailVerified;
    this.image = image;
    this.password = password;
    this.role = role;
    this.isTwoFactorEnabled = isTwoFactorEnabled;
    this.loginProvider = loginProvider;
    this.refreshToken = refreshToken;
    this.credits = credits;
    this.stripeCustomerId = stripeCustomerId;
    this.stripeSubscriptionId = stripeSubscriptionId;
    this.stripePriceId = stripePriceId;
    this.stripeCurrentPeriodEnd = stripeCurrentPeriodEnd;
  }

}