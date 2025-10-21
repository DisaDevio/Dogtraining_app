# Garmin Activity Logger

This application allows you to connect to your Garmin account and view your activities of a certain type.

## Prerequisites

- **Node.js:** This project requires Node.js version `20.19.0` or higher. We recommend using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to manage your Node.js versions.

  To install or switch to the required version using nvm, run the following commands:

  ```bash
  nvm install 20
  nvm use 20
  ```

- **Garmin Connect credentials:** To be able to view details about your activities, a garmin connect account is required.

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

3.  **Run the backend server:**

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

## Build Locally Executable App for macOS

To create a locally executable application for macOS, you can use `electron-packager`.

1.  **Install `electron-packager`:**

    ```bash
    npm install --save-dev electron-packager
    ```

2.  **Add the following script to your `package.json` file:**

    ```json
    "scripts": {
      "package-mac": "electron-packager . --overwrite --platform=darwin --arch=x64 --prune=true --out=release-builds"
    }
    ```

3.  **Run the script to build the app:**

    ```bash
    npm run package-mac
    ```

    This will create a `release-builds` directory with the packaged application.
