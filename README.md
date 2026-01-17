# MiniPlace

My attempt at making a mini version of r/place using Flask, React, and AWS EC2.
Learning SocketIO for both Python backend and SocketIO-client for React frontend.
Wanted to explore handling multiple clients and updating a shared board-state in 
real-time. To make the backend more legitimate, I explored using gunicorn to actually
run the Flask server.

At the same time, also explored using AWS EC2 to host both the frontend and backend.
It's setup where Nginx is used to serve the frontend and reverse proxy to the backend!

This was inspired by [OMCB](https://eieio.games/blog/scaling-one-million-checkboxes/)
But I simplified it by quite a bit, since much of the technology I'm still 
not well-versed in.

## Deployed at
[MiniPlace](http://ec2-13-39-19-104.eu-west-3.compute.amazonaws.com)

Sorry, I'm too cheap to buy a real domain!

## Usage
Just click on the grid! You'll alternate between red, blue, and green.

The page should poll and update its board state every few seconds!

## Docker Backend
You have the option to download the backend server as a docker image and try
to run the frontend locally.

1. Download the Docker Image

```shell
docker pull larrythexu88/miniplace:0.0.1
```

2. Run the Docker Image

```shell
docker run -p 8000:8000 larrythexu88/miniplace:0.0.1
```

3. Run the Frontend

```shell
cd frontend
npm install
npm run dev
```

## Demo
![MiniPlace Demo](./media/miniplace-vid.mov)
