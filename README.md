# User wants to create a website

1. The user fills in the create website form.
2. A hook handles the form submission and manages the loading state.
3. The create website use case handles the incoming request from the client.
4. The website service takes over and performs the necessary business logic.
5. The website repository takes over and performs the insertion into the database.