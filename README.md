# **spiced-imageboard**
## **Noteworthy technologies used**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

## **Description**
This imageboard project was the third major project I did during my training at **[Spiced Academy](https://www.spiced-academy.com/)**.  
It is a basic imageboard project, where you can upload a picture and add comments.

## **Features**
- ### **Front Page**
    - Upload a picture with a username, title and a description
        - That picture will be automatically inserted into the grid view, if the upload was successful
    - Display of the 3 latest pictures uploaded to the site
    - Click on a picture in the grid to open a modal view of that picture
    - Display of a "Load More" button
        - Click on the button fetches 3 additional pictures and inserts them into the grid view
        - Display of the button will be hidden when all pictures were inserted into the grid view
    - Display of a "New images found" button for user A, if user B uploads a picture while both users are online at the same time
        - Clicking on the button will insert the latest image into the grid view
- ### **Modal View**
    - Display of a bigger version of a picture
    - Display of uploader username, date of upload, picture title, picture description
    - Display of comments, if any
    - Add a comment to the current picture with a username
    - Close modal view via a close button or clicking outside of the modal content area
    - Navigate to the next or previous picture, if a picture exists
   

## **Preview**
*to be added*

## **Setup and start**
- ### **Intall node modules**
    Open your terminal, navigate to your project directory and type
    ````console
    npm install
    ````
- ### **Configure PostgreSQL connection**
    Provide an environment variable named `DATABASE_URL` or set it up in [db.js](db.js)
    ````js
    const db = spicedPg(process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/imageboard`);
    ````
    *At SPICED we used a npm module called **[spiced-pg](https://www.npmjs.com/package/spiced-pg)** to simplify the PostgreSQL connection setup*
- ### **Create database tables**
    Database creation files are located in [sql](sql/) directory.  

    Create the **images** table from `images.sql` **first**, then create the **comments** table from `comments.sql`.
- ### **AWS setup**
    This project makes use of the AWS **S3** service, so you should have a user ready, who has access to that service.  
    If you have an AWS user ready to go, then you should create a `secrets.json` file inside the project directory.
    ````json
    {
        "AWS_KEY": "My AWS Key",
        "AWS_SECRET": "My AWS Secret"
    }
    ````
    You can also provide them through environment variables. If you want to do so, then you should also have an environment variable `NODE_ENV` set to `production`.
    The environment variables should be named the same as the keys from the `secrets.json` example: `AWS_KEY` and `AWS_SECRET`.

- ### **Start**
    If everything is set up, then open your terminal, navigate to your project directory and type
    ````console
    npm start
    ````
