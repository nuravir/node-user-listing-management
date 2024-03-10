# Backend Challenge - Restaurant Listing Platform

Hi, this is my Node.JS code to build a sample backend server for a restaurant listing platform that has a multi-level interaction between users, restaurant owners, and admins.

## Project Details

This project implements 

1. JWT Authentication for user login onto the platorm
2. Role-based authorization for CRUD APIs in Listing and Review management.

## Project Structure

### Root: 
1. app.js - runs the server
2. roles.js - contains allowed roles that a user can have
3. package.json -
4. .env - contains the APP_SECRET used by JWT for authentication
5. node_modules - contains all the modules and library we require, for eg jsonwebtoken, mongoose, express

### Models:
1. user.js - contains the basic schema for a user account. We have used email as the primary key, along with a password, role, createdAt fields, but more can be included (for eg username, first_name, last_name, name, phone etc). Keeping in mind OTP-based logins today, the phone number can be used as a primary key instead of email or we could even allow user to sign up with either the phone or email. This schema is generated in MongoDB.

2. listings.js - contains the schema for the restaurant listing. The fields are taken from the specifications in the assignment - name, phone, city, address, images, and reviews. We are for now storing the images as a url, assuming that the we will implement a code to further upload the photos uploaded by the business owner to a storage such as S3, and retrieving the URL.

### Middleware:

1. authorization.js - the authorization middleware contains our jwt generation and implementation. JWT generation happens when a user logs in, we generate a token using the user email and user role and pass it to the response. This can then be stored as a cache on the frontend and use it to authenticate access to the various CRUD APIs, as the decoded token will immediately give us the user object with the role.

### Routes:

1. userController.js - for the purpose of this project, this controller contains the signup and login APIs. Signup creates a new user and login signs in an existing user. Both generate an access token with validity of an hour.

2. listingController.js - 



