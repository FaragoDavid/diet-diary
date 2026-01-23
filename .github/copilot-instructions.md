# Development Guidelines

## Work in TDD

1. Write a failing test
2. Implement code that fixes that test, while not breaking any other tests

## Architecture

### Service Layer Pattern

The service layer exists **only for methods with business logic**. Pass-through methods that simply proxy repository calls are deliberately avoided.

**Use service layer when:**

- Calculating derived values (e.g., nutrition calculations)
- Orchestrating multiple repository calls with validation
- Implementing multi-step business workflows
- Applying domain rules or transformations

**Call repositories directly when:**

- Simple CRUD operations (create, read, update, delete)
- Single repository method calls with no additional logic
- Fetching data for view rendering

This is a deliberate architectural decision to avoid unnecessary abstraction layers.

## Commit

- Write clear, concise commit messages. Keep it one simple sentence, if possible
- Use present tense and imperative mood (e.g., "Add feature" instead of "Added feature" or "Adds feature")
- Commit changes in baby steps to make it easier to review and understand
- Ensure both unit and e2e tests pass before committing code
- Commit only when explicitly instructed to do so

## Other

- No comments, unless absolutely necessary
