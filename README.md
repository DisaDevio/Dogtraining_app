# Garmin Activity Logger

This application allows you to connect to your Garmin account and view your activities of a certain type.

## Prerequisites

- **Node.js:** This project requires Node.js version `20.19.0` or higher. We recommend using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to manage your Node.js versions.

  To install or switch to the required version using nvm, run the following commands:

  ```bash
  nvm install 20
  nvm use 20
  ```

## How to run the application

This application consists of a React frontend and a Flask backend.

### Backend

1.  **Navigate to the `backend` directory:**

    ```bash
    cd backend
    ```

2.  **Install the dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3.  **Set your Garmin credentials as environment variables.** This is to keep your credentials secure.

    ```bash
    export EMAIL="your_garmin_email"
    export PASSWORD="your_garmin_password"
    ```

4.  **Run the backend server:**

    ```bash
    python main.py
    ```

The backend server will be running on `http://127.0.0.1:5001`.

### Frontend

1.  **Navigate to the `frontend` directory:**

    ```bash
    cd frontend
    ```

2.  **Install the dependencies:**

    ```bash
    npm install
    ```

3.  **Run the frontend development server:**

    ```bash
    npm run dev
    ```

The frontend development server will be running on `http://127.0.0.1:5173`.

4.  **Open your web browser** and navigate to `http://127.0.0.1:5173` to see the application.