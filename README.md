
# CampusGrader: Student Reviews for Universities

## Overview

**CampusGrader** is a platform built for students to anonymously rate and review universities. It aims to provide a space where students can share their honest experiences with their institutions, helping prospective students make informed decisions and fostering a transparent academic community. 

The website allows students to submit ratings based on various criteria, leave detailed reviews, and read feedback from others, all while ensuring privacy and anonymity.

### Main Goal

Our goal is to give students a platform where their voices are heard, enabling them to provide candid feedback about their universities. Whether it's about academics, campus life, or student support services, **CampusGrader** empowers students to express their experiences and opinions.

### Features

- **Anonymous Reviews**: Students can rate and review universities without revealing their identity, ensuring a safe and honest space for feedback.
- **University Rating**: Each university can be rated on multiple factors such as:
  - **Academics**
  - **Campus Life**
  - **Student Support**
  - **Facilities**
  - **Overall Experience**
- **Detailed Reviews**: Along with the rating, students can provide detailed reviews covering their experiences, challenges, and what they loved about the university.
- **University Search**: Prospective students can search for universities and read ratings and reviews to make an informed choice.
- **Responsive Design**: The application is built with a mobile-first approach, ensuring it works seamlessly across all devices.

## Technology Stack

- **Next.js**: A React framework used to build the application. Next.js ensures fast page loads and server-side rendering for a better SEO experience.
- **MongoDB**: A NoSQL database for storing user reviews, ratings, and university data. MongoDB's flexibility allows us to handle different types of data efficiently.
- **NextAuth.js**: Provides authentication features for users. NextAuth.js allows for easy integration of OAuth, Google, GitHub login, and more.
- **Aeternity UI**: A modern, user-friendly UI library that ensures the application has a sleek and accessible design. 
- **AWS Cloud**: Amazon Web Services (AWS) is used for hosting the application and storing assets, such as images and university details.
- **Bcrypt**: For securing sensitive data, Bcrypt is used to hash passwords before storing them in the database, ensuring user data protection.

## Getting Started

To run the **CampusGrader** application locally, follow these instructions:

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (or a MongoDB Atlas cluster)
- AWS credentials (for cloud storage)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/campusgrader.git
   ```

2. Navigate into the project directory:

   ```bash
   cd campusgrader
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env.local` file in the root directory and add the following configuration:

   ```bash
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_s3_bucket_name
   NEXTAUTH_URL=http://localhost:3000
   ```

5. Run the application:

   ```bash
   npm run dev
   ```

6. The application will be available at `http://localhost:3000`.

## Features and Usage

### 1. **Review and Rate Universities**

- After logging in, students can search for universities they have attended or are interested in.
- They can then rate each university on various aspects, such as academics, campus life, student support, and facilities.
- Students can leave detailed reviews, providing insight into their experience.

### 2. **Anonymous Experience**

- All reviews are submitted anonymously. The system ensures that students’ identities remain private, allowing for open and honest feedback without fear of judgment.

### 3. **Search and Filter Universities**

- Users can search for universities by name, location, or other filters.
- The university page shows the ratings and reviews left by other students.

### 4. **Responsive Design**

- CampusGrader is designed with responsiveness in mind, ensuring it looks great and functions properly on mobile phones, tablets, and desktop browsers.

### 5. **University Rating Aggregation**

- Each university has an aggregated rating that shows how students rate the university across all categories. This gives prospective students a quick overview of what others think about the institution.

### 6. **User Authentication with NextAuth.js**

- The app uses **NextAuth.js** for secure authentication. Students can log in using their Google or GitHub accounts, ensuring the process is fast and simple.

### 7. **AWS S3 for Cloud Storage**

- Reviews may include images or other assets, all of which are stored securely on AWS S3. This allows for scalable, fast, and cost-effective storage.



## How It Works

1. **University Listings**: Universities are listed on the homepage or via search. Each university card displays aggregated ratings, such as overall ratings and average scores in categories like academics, campus life, etc.
  
2. **Student Reviews**: Students who have logged in can leave a review for any university they’ve attended. Reviews include a title, detailed feedback, and a numerical rating for various aspects.
  
3. **Real-Time Data**: The application allows for real-time data submission and display. When a student submits a review, it’s immediately reflected in the database and displayed on the university page.

4. **Authentication**: NextAuth.js handles user authentication. Students can log in using Google or GitHub accounts to maintain an account, but no personal data is linked to their reviews, maintaining anonymity.

5. **Data Storage**: All reviews and university data are securely stored in MongoDB. Additionally, images and other assets are stored on AWS S3 for easy retrieval.

## Security

- **Bcrypt**: Passwords are securely hashed using Bcrypt before they are stored in the database.
- **Authentication**: NextAuth.js provides secure authentication using OAuth services, keeping student login information safe.
