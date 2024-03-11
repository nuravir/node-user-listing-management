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
3. package.json - contains the list of packages that are required to run the node server. This is important since node_modules aren't pushed into the repo.
4. .env - contains the APP_SECRET used by JWT for authentication - added to .gitignore and shared separately.
5. node_modules - contains all the modules and library we require, for eg jsonwebtoken, mongoose, express - added to .gitignore

### Models:
1. user.js - contains the basic schema for a user account. We have used email as the primary key, along with a password, role, createdAt fields, but more can be included (for eg username, first_name, last_name, name, phone etc). Keeping in mind OTP-based logins today, the phone number can be used as a primary key instead of email or we could even allow user to sign up with either the phone or email. This schema is generated in MongoDB.

2. listings.js - contains the schema for the restaurant listing. The fields are taken from the specifications in the assignment - name, phone, city, address, images, and reviews. We are for now storing the images as a url, assuming that the we will implement a code to further upload the photos uploaded by the business owner to a storage such as S3, and retrieving the URL.

### Middleware:

1. authorization.js - the authorization middleware contains our jwt generation and implementation. JWT generation happens when a user logs in, we generate a token using the user email and user role and pass it to the response. This can then be stored as a cache on the frontend and use it to authenticate access to the various CRUD APIs, as the decoded token will immediately give us the user object with the role.

2. db.js - contains the connection to MongoDB through mongoose. I used a database called ZAG in my localhost, so the connection string is mongodb://localhost:27017/ZAG. Can be edited accordingly. 

### Routes:

1. userController.js - for the purpose of this project, this controller contains the signup and login APIs. Signup creates a new user and login signs in an existing user. Both generate an access token with validity of an hour.

2. listingController.js - contains the CRUD APIs for listings and reviews.


## Possible Improvements:

I've listed here a series of improvements I can make to this code with a little more time - these features would be ideal or beneficial for a practical backend.

0. general - better error handling. Since this was a sample project, I didn't have enough time to include error handling try-catch blocks and custom exception handlers and messages across the code. I've experience doing this however.

1. user.js
- hashing the password before storing.
- validations for email, password strength.
- more ways to signup - can be phone number (OTP), or any third party auths like Google, Facebook etc. I've experience integrating these in backend.

2. listings.js
- right now we've a placeholder for images as image url, but ideally i'd like to have a piece of code to allow the user to upload the images and store them at a secure location like S3 in AWS, and save those URLs here. 
- more complex validations for listings, as I feel the primary key should be a combination of Name + Owner + Address + City. 
- I didn't show the average rating of the listing when listing all ratings yet. I can implement this if required to be shown, let me know if I need to. 

3. routes - the controllers could be more organized and annotated. For our purposes, they are complete.

4. API Documentation - I have shared the postman API collection. We can auto-generate an API doc with Swagger integration too. I wasn't able to do that in due time, but can integrate it if required.


