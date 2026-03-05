# Postman Test Cases - Project APIs

Use these test cases to verify the Project Management APIs.

## 1. Create Project (Admin Only)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/projects`
- **Headers:** 
    - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
    - `Content-Type`: `application/json`
- **Body (JSON):**
```json
{
    "project_name": "New Team Project",
    "description": "This is a test project for development",
    "members": ["<USER_ID_1>", "<USER_ID_2>"]
}
```
- **Expected Status:** `201 Created`

## 2. Get All Projects
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/projects`
- **Headers:** 
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Behavior:** 
    - If **Admin:** Returns all projects in the database.
    - If **Member:** Returns only projects where the user is a member or the creator.
- **Expected Status:** `200 OK`

## 3. Get Single Project
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/projects/<PROJECT_ID>`
- **Headers:** 
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Status:** `200 OK` (if authorized) or `403 Forbidden` (if not authorized)

## 4. Delete Project (Admin Only)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/projects/<PROJECT_ID>`
- **Headers:** 
    - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
- **Expected Status:** `200 OK`

---

### Authentication Note
For all requests, ensure you first login via `/api/auth/login` to get the JWT token, then add it to the **Auth** tab in Postman as a **Bearer Token**.
