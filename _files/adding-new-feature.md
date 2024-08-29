# Adding a new feature using clean architecture
## Domain
1. Create an entity for the feature, this uses the dto
2. Create a repository for the operations
3. Create a service, In the service file, you can define the business logic for the feature. This includes methods for creating, updating, deleting, and retrieving features. The service interacts with the repository to perform the necessary database operations.


## Infrastructure
1. Create a repositorie where the database interactions will be defined.

## Application
1. Implement the useCase
2. Service