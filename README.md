# Video Calling App with WebRTC and Socket.io

## Overview

This project is a real-time video calling application built using WebRTC for peer-to-peer communication and Socket.io for signaling. The app enables users to connect with others through high-quality video calls directly in their web browsers without requiring plugins or additional software.

## Key Features

- **Real-time video calling** between two or more participants
- **Peer-to-peer connection** using WebRTC for optimal performance
- **Signaling server** powered by Socket.io for connection establishment
- **Responsive interface** that works across devices
- **Call history tracking** to view previous calls
- **Simple authentication** 
- **Cross-browser compatibility** for major modern browsers

## Technology Stack

- **Frontend**: React.js 
- **Signaling**: Socket.io
- **Video Communication**: WebRTC (PeerConnection, getUserMedia API)
- **Styling**: Tailwind CSS 
- **Backend**: Node.js with Express (for signaling server)

## Architecture

The application follows a standard WebRTC architecture with:

1. **Client Application**: Handles user interface and media capture
2. **Signaling Server**: Coordinates session establishment between peers
3. **STUN/TURN Servers**: For NAT traversal (using free/public servers)

## Setup Requirements

To run this application, you'll need:

1. Node.js environment (v14 or higher recommended)
2. Modern web browser with WebRTC support (Chrome, Firefox, Edge, Safari)
3. HTTPS connection (required for WebRTC in production)
4. Basic audio/video hardware (webcam and microphone)

## Development Notes

- The signaling server uses WebSockets via Socket.io for real-time communication
- WebRTC handles the actual media streaming between peers
- The app includes error handling for various WebRTC scenarios

## Future Enhancements

- Text chat alongside video calls
- Screen sharing capabilities
- Call recording functionality
- Group video calling
- Improved error handling and user notifications
- End-to-end encryption for enhanced privacy

## License

This project is open-source and available under the MIT License.

