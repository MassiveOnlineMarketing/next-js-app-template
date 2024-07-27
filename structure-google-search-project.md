src/
├── presentation/    # Handles all the UI and presentation logic. In a web application, this would include controllers, view models, and data transfer objects (DTOs) that are used to send data to the client. It's the entry point for user interactions, translating user actions into operations on the application layer. Here we check for auth.
│   ├── controllers/
│   │   ├── GoogleSearchProjectController.ts  # Controllers to handle HTTP requests
│   ├── dto/
│   │   ├── GoogleSearchProjectDto.ts  # Data transfer objects for Google Search Projects
│   ├── middleware/
│   │   ├── AuthMiddleware.ts  # Middleware for authentication
│   ├── hooks/
│   │   ├── useCurrentUser.tsx  # Client-side hook for current user session
│   ├── utils/
│   │   ├── auth.ts  # Server-side function for session management
├── app.ts  # Application entry point

├── application/    # Coordinates high-level application operations and workflows. It translates requests from the outer layers (presentation/web layer) into operations on domain entities, often involving orchestrating calls to several domain objects and their methods.
│   ├── services/
│   │   ├── GoogleSearchProjectService.ts  # Application logic for managing Google Search Projects
│   ├── useCases/
│   │   ├── createGoogleSearchProject.ts  # Use case for creating a Google Search Project
│   │   ├── deleteGoogleSearchProject.ts  # Use case for deleting a Google Search Project

├── domain/      # Represents the business logic and rules of the application. It is the heart of the application's functionality, encapsulating the entities, value objects, and domain services that define the business operations.
│   ├── googleSearchConsole/
│   │   ├── entities/
│   │   │   ├── GoogleSearchProject.ts  # Entity representing a Google Search Project
│   │   ├── repositories/
│   │   │   ├── IGoogleSearchProjectRepository.ts  # Interface for Google Search Project repository
│   │   ├── services/
│   │       ├── GoogleSearchProjectDomainService.ts  # Domain services for business rules

├── infrastructure/      # Provides technical capabilities that support the higher layers. This includes things like database access, file storage, external services integration, and the concrete implementation of repository interfaces defined in the domain layer.
│   ├── database/
│   │   ├── Database.ts  # Database connection and utilities
│   ├── repositories/
│   │   ├── GoogleSearchProjectRepository.ts  # Implementation of IGoogleSearchProjectRepository


The structure you've outlined follows the principles of a layered architecture, which separates concerns within an application to promote clean code and scalability. Here's a brief overview of each layer's responsibilities:

1. # Domain Layer
Purpose: Represents the business logic and rules of the application. It is the heart of the application's functionality, encapsulating the entities, value objects, and domain services that define the business operations.
Components:
Entities: Business objects unique within the domain context (e.g., GoogleSearchProject).
Repositories Interfaces: Abstractions for how the domain entities are retrieved from and persisted to storage, without defining the actual implementation.
Domain Services: Encapsulate business logic that doesn't naturally fit within a single entity.
2. # Application Layer
Purpose: Coordinates high-level application operations and workflows. It translates requests from the outer layers (presentation/web layer) into operations on domain entities, often involving orchestrating calls to several domain objects and their methods.
Components:
Services: Application services that execute specific business use cases (e.g., GoogleSearchProjectService).
Use Cases: Specific scenarios within the application, such as creating or deleting a Google Search Project.
3. # Infrastructure Layer
Purpose: Provides technical capabilities that support the higher layers. This includes things like database access, file storage, external services integration, and the concrete implementation of repository interfaces defined in the domain layer.
Components:
Database Utilities: Tools and utilities for database connections and operations.
Repositories: Concrete implementations of the repository interfaces defined in the domain layer, responsible for data access and manipulation.
4. # Presentation Layer
Purpose: Handles all the UI and presentation logic. In a web application, this would include controllers, view models, and data transfer objects (DTOs) that are used to send data to the client. It's the entry point for user interactions, translating user actions into operations on the application layer.
Components:
Controllers: Handle incoming HTTP requests, invoke application layer operations, and return responses.
DTOs: Define the structure of data as it's sent to or received from the client.
Middleware: Components that execute before or after controllers, often used for cross-cutting concerns like authentication and logging.

Each layer has a distinct responsibility, and they communicate with each other in a defined way, usually from outer layers (presentation) to inner layers (domain). This separation ensures that changes in one part of the application (like the UI or database) have minimal impact on other parts, making the application easier to maintain and extend.


# Example flow
1. UI Layer (Presentation)
The UI makes a request to the backend, possibly sending data like form fields.
This layer is responsible for capturing user inputs and sending them to the appropriate backend endpoint.
2. Application Layer (Use Cases)
The backend endpoint receives the request. This is where your use cases reside.
Authentication and Authorization: First, you validate if the user is authenticated and authorized to perform the action.
Validation: Next, validate the input data to ensure it meets the expected format and business rules (e.g., a user can create a project).
Business Logic: Apply any business logic that is necessary to process the request. For example, checking if a user has reached a limit of projects they can create.
Data Structure Preparation: Prepare the data in the correct structure/format for the next steps.
3. Domain Layer
Although closely related to the application layer in some implementations, the domain layer primarily defines the business entities, rules, and interfaces (like repositories) that represent operations which can be performed on these entities.
The use case interacts with the domain layer to manipulate business entities according to the business rules.
4. Infrastructure Layer (Data Persistence)
Repository Implementation: This layer implements the repository interfaces defined in the domain layer. For creating a project, the infrastructure layer would have a concrete implementation of the project repository interface.
Database Interaction: The infrastructure layer handles all interactions with the database, such as inserting the new project data. This is done based on the data structure and commands provided by the application/use case layer.
Example Flow
UI Layer: User submits a form to create a new project.
Application Layer: Validates user authentication, authorizes the action, validates input data, and applies necessary business logic.
Domain Layer: Defines the structure and rules around creating a new project.
Infrastructure Layer: Takes the validated and structured data from the application layer and inserts it into the database.
This flow ensures that each layer has a clear responsibility, from handling user input and applying business logic to interacting with the database, all while keeping the core business logic isolated from external concerns.