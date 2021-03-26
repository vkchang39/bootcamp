# BOOTCAMP API

> Backend API for DevCamper application, which is a bootcamp directory website

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

-   Version: 1.0.0
-   License: MIT
-   Author: Vijay Kumar

# API

## Indices

-   [Authentication](#authentication)

    -   [Forgot Password](#1-forgot-password)
    -   [Getting User](#2-getting-user)
    -   [Login a User](#3-login-a-user)
    -   [Logout a User](#4-logout-a-user)
    -   [New Request](#5-new-request)
    -   [Register User](#6-register-user)
    -   [Reset Password](#7-reset-password)
    -   [Update USER Details](#8-update-user-details)
    -   [Update USER Password](#9-update-user-password)

-   [Bootcamps](#bootcamps)

    -   [Create new Bootcamp](#1-create-new-bootcamp)
    -   [Delete Bootcamp](#2-delete-bootcamp)
    -   [Get all Bootcamps](#3-get-all-bootcamps)
    -   [Get single Bootcamp](#4-get-single-bootcamp)
    -   [Update Bootcamp](#5-update-bootcamp)
    -   [Upload File](#6-upload-file)

-   [Courses](#courses)

    -   [Create a Bootcamp course](#1-create-a-bootcamp-course)
    -   [Delete a Course](#2-delete-a-course)
    -   [Get Courses from a Bootcamp](#3-get-courses-from-a-bootcamp)
    -   [Get a single Course](#4-get-a-single-course)
    -   [Get all Courses](#5-get-all-courses)
    -   [Update a Course](#6-update-a-course)

-   [Reviews](#reviews)

    -   [Add review for bootcamp](#1-add-review-for-bootcamp)
    -   [Delete a review for bootcamp](#2-delete-a-review-for-bootcamp)
    -   [Get all reviews.](#3-get-all-reviews)
    -   [Get reviews for bootcamp.](#4-get-reviews-for-bootcamp)
    -   [Get single review.](#5-get-single-review)
    -   [Update a review for bootcamp](#6-update-a-review-for-bootcamp)

-   [USERS](#users)

    -   [Create User](#1-create-user)
    -   [Delete a User](#2-delete-a-user)
    -   [Getting User](#3-getting-user)
    -   [Getting single User](#4-getting-single-user)
    -   [Update USER Details](#5-update-user-details)

---

## Authentication

Routes for using user authentication for register, login, reset password, etc.

### 1. Forgot Password

Generate forgot password token and send an email.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/auth/forgotpassword
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "email":"mary@gmail.com"
}
```

### 2. Getting User

getting logged in user details

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/auth/me
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

### 3. Login a User

verify login credentials in database.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/login
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "email":"aman@aman.com",
    "password":"123456"
}
```

### 4. Logout a User

clear token cookie and logout a user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/auth/logout
```

### 5. New Request

**_Endpoint:_**

```bash
Method: GET
Type:
URL:
```

### 6. Register User

Add a user to database with encrypted password.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/register
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "name":"aman kumar",
    "email":"aman@aman.com",
    "password":"amankumar"
}
```

### 7. Reset Password

reset password with token

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/resetpassword/d5b6c512cf0181dfa9e23892e76c2e9e9ed29953fbf6f1e484
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "password":1234566
}
```

### 8. Update USER Details

update loggedin user, only name

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/updatedetails
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "name": "aman",
    "email": "aman@aman.com"
}
```

### 9. Update USER Password

Update logged in user's password by providing currentPassword.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/updatepassword
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "currentPassword":"amankumar",
    "newPassword": "123456"

}
```

## Bootcamps

Bootcamps CRUD functionality.

### 1. Create new Bootcamp

Add new Bootcampt to database. Must be authenticated. Must be Autor or Admin.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps
```

**_Headers:_**

| Key           | Value                                                                                                                                                                              | Description |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Content-Type  | application/json                                                                                                                                                                   | JSON type   |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDk5YjExYmM3N2RhMmYwY2Y2M2Q0NyIsImlhdCI6MTYxNTUwNTgwMywiZXhwIjoxNjE4MDk3ODAzfQ.r9r7ioIdShFO044TsUyHs5n0g17-wHPNLcpu3RdWD98 |             |

**_Body:_**

```js
{
    "name": "Test Bootcamp",
		"description": "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX",
		"website": "https://moderntech.com",
		"phone": "(222) 222-2222",
		"email": "enroll@moderntech.com",
		"address": "220 Pawtucket St, Lowell, MA 01854",
		"careers": ["Web Development", "UI/UX", "Mobile Development"],
		"housing": false,
		"jobAssistance": true,
		"jobGuarantee": false,
		"acceptGi": true
}
```

### 2. Delete Bootcamp

Delete Bootcamp from database

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URL}}/api/v1/bootcamps/604ab5e62625081964fcf298
```

### 3. Get all Bootcamps

Feth all Bootcamps from database. Includes pagination, filtering, etc

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps
```

### 4. Get single Bootcamp

Get single Bootcamp by ID.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/5ff1a8f8c0586a347892ec9a
```

### 5. Update Bootcamp

Update single Bootcamp in database.

**_Endpoint:_**

```bash
Method: PUT
Type:
URL: {{URL}}/api/v1/bootcamps/1
```

### 6. Upload File

Route to upload a file to bootcamp.

**_Endpoint:_**

```bash
Method: PUT
Type:
URL: {{URL}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/photo
```

## Courses

Create, Update, Delete Courses

### 1. Create a Bootcamp course

create a course for a specific boorcamp.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5d713995b721c3bb38c1f5d0/courses
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
		"title": "Full Stack Web Development",
		"description": "In this course you will learn full stack web development, first learning all about the frontend with HTML/CSS/JS/Vue and then the backend with Node.js/Express/MongoDB",
		"weeks": 12,
		"tuition": 10000,
		"minimumSkill": "intermediate",
		"scholarhipsAvailable": true
        }
```

### 2. Delete a Course

delete a course from database by id

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URL}}/api/v1/courses/5d725a4a7b292f5f8ceff789
```

### 3. Get Courses from a Bootcamp

get all courses from a specific bootcamp

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/courses
```

### 4. Get a single Course

get a single course by id

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/courses/5d725a4a7b292f5f8ceff789
```

### 5. Get all Courses

Get all Courses in database.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/courses
```

### 6. Update a Course

update a course in database with id

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/courses/5d725a4a7b292f5f8ceff789
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "weeks": 10
}
```

## Reviews

Manage course reviews.

### 1. Add review for bootcamp

Insert review for a specific bootcamp.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/reviews
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "title":"Nice Bootcamp",
    "text":"Bootcamp is amazing",
    "rating": 9
}
```

### 2. Delete a review for bootcamp

logged in user and admin can delete their review.

**_Endpoint:_**

```bash
Method: DELETE
Type: RAW
URL: {{URL}}/api/v1/reviews/605ca27728e52d46e8b85721
```

### 3. Get all reviews.

Get all reviews from database and populate it with bootcamp name and description.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/reviews
```

### 4. Get reviews for bootcamp.

get the reviews for a specific bootcamp.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/reviews
```

### 5. Get single review.

get a single review from dataabase and populate it with bootcamp name and description.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/reviews/5d7a514b5d2c12c7449be025
```

### 6. Update a review for bootcamp

logged in users can update their review for bootcamp.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/reviews/605ca27728e52d46e8b85721
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "title":"Good Bootcamp",
    "text":"Bootcamp is amazing",
    "rating": 9
}
```

## USERS

CRUD functionality for user, only available to admins.

### 1. Create User

Create users in database by admin.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/users
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "name":"aman kumar admin",
    "email":"aman@admin.com",
    "password":"amankumar"
}
```

### 2. Delete a User

delete a user from database

**_Endpoint:_**

```bash
Method: DELETE
Type: RAW
URL: {{URL}}/api/v1/users/5d7a514b5d2c12c7449be045
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

### 3. Getting User

getting all users by admin with advanced results

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/users
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

### 4. Getting single User

getting single user from database by his/her id.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/users/60574352977b1c22f83b03a3
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

### 5. Update USER Details

update any detail of an user by admin.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/users/60574352977b1c22f83b03a3
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON type   |

**_Body:_**

```js
{
    "name": "aman",
    "email": "aman@aman.com"
}
```

---

[Back to top](#api)

> Made with &#9829; by [vijayKumar](https://github.com/vkchang39) | Generated at: 2021-03-26 00:39:34 by [docgen](https://github.com/thedevsaddam/docgen)
