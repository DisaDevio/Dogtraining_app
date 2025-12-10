# Garmin Activity Logger

This application allows you to connect to your Garmin account using password and username and view your hunting activities, including running and hiking.
The app will track the progress of dog training, allow the user to input data about the hunt and provides an overview of birds and hunts.

## Prerequisites

- **Node.js:** This project requires Node.js version `20.11.0` or higher.

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
    npm run package
    ```

    This will create a `release-builds` directory with the packaged application.
