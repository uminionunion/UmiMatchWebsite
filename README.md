# UmiMatch Standalone Website

## Overview
UmiMatch is a standalone social matchmaking application designed to operate as a decoupled service while maintaining full data compatibility with the main uHub ecosystem. It implements a "swipe-to-match" mechanic where users create social profiles, discover other enrolled members, and initiate private chats upon mutual liking.

## Technical Architecture

### 1. Tech Stack
- **Backend:** Node.js with Express.
- **Language:** TypeScript (compiled to JavaScript).
- **Database:** SQLite (managed via Kysely query builder for type-safe SQL).
- **Authentication:** JWT (JSON Web Tokens) stored in cookies.
- **Containerization:** Docker & Docker Compose.

### 2. Core Feature Logic
- **Profiles:** Users can manage a matching profile containing a bio, location (city), gender, interest preferences, and up to 5 images.
- **Discovery:** The system filters users who are `enrolled`, have not been "seen" (swiped) by the current user, and are not the current user.
- **Matching Engine:**
    - **Like:** Creates a record in `UmiMatchSwipes`. The system immediately checks for a reciprocal "like" from the target user. If found, it is flagged as a `match`.
    - **Skip:** Marks a user as seen with a `skip` action, removing them from future discovery.
- **Messaging:** A private 1-to-1 messaging system that only becomes accessible once a mutual match is established.
- **Account Removal:** A safety-first deletion process that archives all user profiles, swipes, and messages into a `DeletedUmiMatchAccounts` table before removing active records.

### 3. Database Schema
- `UmiMatchProfiles`: User preferences, enrollment status, and profile metadata.
- `UmiMatchSwipes`: Log of all likes and skips.
- `UmiMatchMessages`: Chat history between matched users.
- `DeletedUmiMatchAccounts`: JSON archives of removed accounts for recovery/auditing.

---

## Shared Data & Volume Configuration

This application is designed to share its state (users, matches, and messages) with the main uHub implementation. To achieve this, both applications must point to the same SQLite database file.

### How to share data between uHub and UmiMatchWebsite:

1. **Identify the Data Volume:**
   In the main uHub project, identify the host folder where `database.sqlite` is stored (usually a Docker volume or a local `/data` folder).

2. **Configure Docker Compose:**
   In the `docker-compose.yml` of this standalone project, update the `volumes` section to point to the **same host path** used by uHub.

   **Example:**
   ```yaml
   volumes:
     - /path/to/uhub/data:/app/data
   ```

3. **Synchronize JWT Secret:**
   For users to be authenticated across both sites without logging in twice, the `JWT_SECRET` environment variable must be identical in both projects.
   
   **In `.env` or `docker-compose.yml`:**
   ```yaml
   environment:
     - JWT_SECRET=your-shared-secret-key
   ```

4. **Database Compatibility:**
   Since both apps use the same Kysely schema definitions, any update made to a profile or a "like" in the standalone site will be instantly reflected in the uHub version and vice versa.

---

## Development & Deployment

### Local Setup
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Start in dev mode: `npm run dev`

### Docker Deployment
1. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```
2. The API will be available at `http://localhost:4000`.
