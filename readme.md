# YouTube Backend Clone

This project is a backend API built using **Express**, **MongoDB**, and **Mongoose** that simulates the core features of YouTube. The backend handles user authentication, video uploads, and provides endpoints for managing videos, comments, likes, and subscriptions. The API is designed to serve as the foundation for a video-sharing platform, with MongoDB used for storing data and Mongoose simplifying database interaction.

## Features:
- **User Authentication**: Secure sign-up and login using JWT-based authentication.
- **Video Uploads**: Users can upload videos, which are stored in the database.
- **Video Management**: Users can add, update, and delete videos.
- **Subscription System**: Users can subscribe to channels and receive updates on new videos using an efficient subscription model.
- **RESTful API**: Endpoints to handle all the video and user-related operations.

## Tech Stack:
- **Express**: Fast, unopinionated web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user data, video metadata, interactions, and subscriptions.
- **Mongoose**: ODM for MongoDB to interact with the database using models.
- **JWT**: JSON Web Tokens for secure user authentication.

## MongoDB Pipelines:
- **Subscriptions**: To implement the subscription feature efficiently, MongoDB pipelines are used to aggregate and retrieve videos from subscribed channels without needing to fetch unnecessary data.
- MongoDB aggregation pipelines are employed to handle complex queries such as fetching videos from users a given user subscribes to, enabling better performance by reducing the number of database queries and ensuring the app can scale with more users and content.


