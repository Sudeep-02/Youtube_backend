# YouTube Backend Clone

Built a backend API to replicate YouTube features, including user authentication, video uploads and management, and subscription functionality. Multer and Cloudinary are used for efficient video file uploads and storage.

## Features:
- **User Authentication**: Secure sign-up and login with JWT-based authentication.
- **Video Uploads**: Users can upload videos stored in Cloudinary.
- **Video Management**: Users can add, update, and delete videos.
- **Subscription System**: Users can subscribe to channels and receive updates on new videos.
- **RESTful API**: Endpoints for video and user operations.

## Tech Stack:
- **JavaScript**
- **Multer**: Middleware for handling video uploads.
- **Cloudinary**: Cloud storage for video files.
- **JWT**: Secure user authentication. 

## Optimizations:
- **MongoDB Pipelines**: Efficient aggregation and retrieval of videos from subscribed channels for better performance and scalability.
