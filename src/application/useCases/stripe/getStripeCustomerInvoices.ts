'use server'

import { auth } from "@/application/services/AuthService"
import { stripe, StripeService } from "@/application/services/StripeService";
import { SimpleError } from "@/domain/errors/simpleErrors";

export async function getStripeCustomerInvoices() {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'Unauthorized' };
  }


  const stripeService = new StripeService(stripe);

  try {
    const userIncoices = await stripeService.getCustomerInvoices(session.user.id);
    
    return { success: true, data: userIncoices };
    
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error getting stripe subscription for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('getStripeUserSubscription',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}