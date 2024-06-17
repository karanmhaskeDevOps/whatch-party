

```markdown
# Watch Party Application

A web application for synchronized video playback with video calling and chat functionality.

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Git

## Installation

### 1. Clone the Repository

First, clone the repository to your local machine:

```sh
git clone https://github.com/your-repo/watch-party.git
cd watch-party
```

### 2. Install Node.js Dependencies

Next, install the required Node.js dependencies:

```sh
npm install
```

### 3. Start the Server

Start the Node.js server:

```sh
npm start
```

### 4. Serve the HTML File (Optional)

If you want to serve the HTML file using `http-server`, install it globally:

```sh
sudo npm install -g http-server
```

Then, serve the `public` directory:

```sh
http-server public -p 80
```

## Project Structure

```
watch-party/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
├── server.js
└── README.md
```

## Features

- **Video Selection**: Allows users to select a video file from their local device.
- **Synchronized Playback**: Ensures that play, pause, and seek actions are synchronized across all users.
- **Real-time Chat**: Enables users to chat with each other in real-time.
- **Video Calling**: Supports video calling between users using WebRTC.
- **Simple UI**: Provides a simple and intuitive user interface.

## Deployment on AWS EC2

### Step 1: Launch an EC2 Instance

1. Log in to your AWS Management Console.
2. Navigate to the EC2 Dashboard.
3. Click on "Launch Instance".
4. Choose "Ubuntu Server 20.04 LTS" as the AMI.
5. Select an instance type (e.g., `t2.micro` for free tier eligibility).
6. Configure the instance details as needed.
7. Add storage (the default is usually sufficient).
8. Add tags (optional).
9. Configure the security group:
   - Allow HTTP traffic on port 80.
   - Allow WebSocket traffic on port 8080.
   - Allow SSH traffic on port 22 (for connecting to the instance).
10. Review and launch the instance.
11. Download the key pair (`.pem` file) and keep it secure.

### Step 2: Connect to the EC2 Instance

Use SSH to connect to your instance:

```sh
ssh -i your-key-pair.pem ubuntu@your-instance-public-ip
```

### Step 3: Install Necessary Software

Update the package list and install Node.js, npm, and Git:

```sh
sudo apt update
sudo apt install -y nodejs npm git
```

### Step 4: Set Up the Project on the EC2 Instance

Clone your project repository:

```sh
git clone https://github.com/your-repo/watch-party.git
cd watch-party
```

### Step 5: Install Node.js Dependencies on the EC2 Instance

Install the necessary Node.js packages:

```sh
npm install
```

### Step 6: Start the Node.js Server on the EC2 Instance

Run the server:

```sh
npm start
```

### Step 7: Serve the HTML File on the EC2 Instance (Optional)

Install `http-server` globally if you haven't done so:

```sh
sudo npm install -g http-server
```

Serve the `public` directory:

```sh
http-server public -p 80
```

### Step 8: Access Your Application

Open your browser and navigate to `http://your-instance-public-ip` to access your watch party application.

### Step 9: Update WebSocket URL

Update the WebSocket URL in your `public/app.js` file to match your server IP:

```javascript
const socket = io('http://your-instance-public-ip:8080');
```

## Future Enhancements

- **Authentication**: Add user authentication to manage access to the watch party.
- **Advanced UI**: Design a more advanced and user-friendly UI with custom controls and features.
- **Mobile Support**: Ensure the application is responsive and works well on mobile devices.
- **Multiple Video Sources**: Allow users to choose from a library of videos or stream from online sources.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note:** Replace `your-repo` with the actual repository name and `your-instance-public-ip` with the public IP address of your EC2 instance. If you plan to add a license, create a `LICENSE` file in your project root with the appropriate license text. For the MIT license, you can find the template [here](https://opensource.org/licenses/MIT).
```

This detailed `README.md` file provides comprehensive instructions for setting up and deploying the Watch Party application, ensuring that users can follow along easily.
