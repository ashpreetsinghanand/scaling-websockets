# Scaling Websockets

## Overview

This project demonstrates how to scale WebSocket connections using Redis to manage state, connection limits, and message priorities in a distributed environment. It includes rate limiting, heartbeat management, and real-time message broadcasting between multiple WebSocket servers.

## Features

- Redis-based session and connection management.
- Rate limiting for message control.
- Priority-based message broadcasting.
- Heartbeat interval adjustments based on load.
- Supports multiple WebSocket servers.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v18 or later)
- [Redis](https://redis.io/docs/getting-started/) server

## Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/ashpreetsinghanand/scaling-websockets.git
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd scaling-websockets
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Start the WebSocket Server**:
    ```bash
    cd src
    node index.js
    ```

## Testing the WebSocket

1. Open [Hoppscotch](https://hoppscotch.io/realtime/websocket).
2. Paste the WebSocket URL: ws://localhost:8080
3. Start sending and receiving real-time messages.

## Video Demonstration

- **Part 1**: [Scaling WebSockets - Part-1](https://youtu.be/IX1SmtOmCGs)
- **Part 2**: [Scaling WebSockets - Part-2](https://youtu.be/6CXhOeY0eWc)
