# Campus Lost & Found Tracker

## Project Description

The Campus Lost & Found Tracker is a TypeScript-based application that helps students and security administrators manage lost and found items within a campus. Students can report lost or found items, while security administrators verify claims and help return items to their rightful owners. The project demonstrates the use of TypeScript interfaces, utility types, enums, generics, union types, intersection types, and type aliases.

## Interfaces and Types

### Interfaces
- User
- Item
- Claim
- ApiResponse<T>

### Utility Types
- UserUpdate (Partial<User>)
- UserPreview (Pick<User>)
- PublicUser (Omit<User>)
- UserCount (Record)

### Type Aliases
- ID
- Location
- DateFormatter
- StringOrNumber
- ItemStatus
- ItemWithOwner

### Enums
- ClaimStatus
- UserRole

## Installation

Install the dependencies:

```bash
npm install
```

## Running the Project

Execute the project using:

```bash
npx ts-node src/index.ts
```

## Type Checking

Run the TypeScript compiler without generating JavaScript files:

```bash
npx tsc --noEmit
```