# Assessment Notes

## 1. Supporting multiple users
I would add a `userId` field to each task and make it a required reference to a User collection. I would add authentication (for example, JWT-based login) and derive the user identity from the verified token, then scope every task query, update, and delete by that user ID so users cannot access one another's tasks.

## 2. Supporting thousands of tasks
My first concern would be returning and rendering the entire task collection on every request. I would add server-side pagination (limit/skip or cursor-based pagination), appropriate indexes such as `{ userId: 1, status: 1, dueDate: 1 }` when multi-user support is added, and have the frontend request only the current page.

## 3. AI coding tools
I used ChatGPT to help plan the project structure, review implementation details, and explain the MERN workflow. I reviewed the generated suggestions rather than accepting them blindly; for example, I used an explicit priority ranking (low, medium, high) for sorting instead of relying on alphabetical string sorting, because alphabetical order does not represent task priority correctly. I tested and adjusted the implementation to match the assignment requirements.
