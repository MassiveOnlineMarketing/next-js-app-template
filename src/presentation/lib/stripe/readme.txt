# Buy credits 

will trigger webhook:
checkout.session.completed - data.subscription = null 


# subscribe to subscription

will trigger webhook:
customer.subscription.updated - will include the data.subscription 
checkout.session.completed - will include the data.subscription 
invoice.payment_succeeded
