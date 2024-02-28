# Health Clinic API

This is a RESTful API for a health clinic application.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/health-clinic-api.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   PORT=5000
   JWT_SECRET=Your Secret key Goes Here
   MONGODB_URL=mongodb://localhost:27017/health-clininc (replace your atlas connection string if needed)
   ```

4. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

- `/patients`: Get all patients
- `/patients/:id`: Get a specific patient
- `/patients`: Create a new patient
- `/patients/:id`: Update a specific patient
- `/patients/:id`: Delete a specific patient
