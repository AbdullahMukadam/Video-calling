class PeerService {
    peer: RTCPeerConnection | null = null;
    private streamCleanupCallbacks: (() => void)[] = [];
    private mediaConstraints = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    };
    // Buffer for ice candidates received before remote description is set
    private pendingIceCandidates: RTCIceCandidate[] = [];
    // Flag to track if remote description is set
    private hasRemoteDescription = false;

    constructor() {
        this.createNewConnection();
    }

    createNewConnection() {
        console.log("Creating completely new peer connection");
        this.cleanup();

        // Reset state variables
        this.pendingIceCandidates = [];
        this.hasRemoteDescription = false;

        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun.relay.metered.ca:80",
                    ]
                },
                {
                    urls: "turn:global.relay.metered.ca:80",
                    username: "eede1ae4de891c23eb142d51",
                    credential: "4PbvmYH14/djwdB3",
                },
                {
                    urls: "turn:global.relay.metered.ca:80?transport=tcp",
                    username: "eede1ae4de891c23eb142d51",
                    credential: "4PbvmYH14/djwdB3",
                },
                {
                    urls: "turn:global.relay.metered.ca:443",
                    username: "eede1ae4de891c23eb142d51",
                    credential: "4PbvmYH14/djwdB3",
                },
                {
                    urls: "turns:global.relay.metered.ca:443?transport=tcp",
                    username: "eede1ae4de891c23eb142d51",
                    credential: "4PbvmYH14/djwdB3",
                },
            ]
        });

        this.setupEventListeners();

        return this.peer;
    }

    private setupEventListeners() {
        if (!this.peer) return;

        this.peer.oniceconnectionstatechange = () => {
            console.log('ICE connection state changed:', this.peer?.iceConnectionState);

            // Handle disconnected state
            if (this.peer?.iceConnectionState === 'disconnected' ||
                this.peer?.iceConnectionState === 'failed' ||
                this.peer?.iceConnectionState === 'closed') {
                console.log(`ICE connection ${this.peer?.iceConnectionState}, may need restart`);
            }
        };

        this.peer.onicegatheringstatechange = () => {
            console.log('ICE gathering state changed:', this.peer?.iceGatheringState);
        };

        this.peer.onsignalingstatechange = () => {
            console.log('Signaling state changed:', this.peer?.signalingState);

            // If connection failed, handle cleanup
            if (this.peer?.signalingState === "closed") {
                console.log("Connection closed, cleaning up resources");
                this.cleanup();
            }
        };

        // Set up default ice candidate handler to log events
        this.peer.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate generated but no handler attached', event.candidate);
            } else {
                console.log('ICE gathering complete');
            }
        };
    }

    async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
        // Always create a fresh connection for new offers
        // This is crucial to avoid m-line ordering issues
        this.createNewConnection();

        if (!this.peer) {
            console.error('Failed to create peer connection');
            return undefined;
        }

        try {
            console.log("Creating new offer, current signaling state:", this.peer.signalingState);

            // Create transceivers with consistent ordering before creating the offer
            // This ensures m-lines will have a consistent order
            this.peer.addTransceiver('audio', { direction: 'sendrecv' });
            this.peer.addTransceiver('video', { direction: 'sendrecv' });

            const offer = await this.peer.createOffer(this.mediaConstraints);
            await this.peer.setLocalDescription(offer);

            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            // Clean up on error but don't recursively retry
            this.cleanup();
            return undefined;
        }
    }

    async generateAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
        if (!this.peer) {
            console.log('Creating new connection for answer');
            this.createNewConnection();
        }

        if (!this.peer) {
            console.error('Failed to create peer connection');
            return undefined;
        }

        try {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            this.hasRemoteDescription = true;

            // Process any pending ICE candidates
            this.processPendingIceCandidates();

            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error('Error generating answer:', error);
            this.cleanup();
            return undefined;
        }
    }

    async setAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }

        try {
            await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
            this.hasRemoteDescription = true;

            // Process any pending ICE candidates
            this.processPendingIceCandidates();
        } catch (error) {
            console.error('Error setting answer:', error);
            this.cleanup();
        }
    }

    async iceCandidate(onIceCandidateCallback: (candidate: RTCIceCandidate) => void): Promise<void> {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }

        this.peer.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate generated:', event.candidate.candidate?.substring(0, 30) + '...');
                onIceCandidateCallback(event.candidate);
            } else {
                console.log('ICE gathering complete');
            }
        };
    }

    async addIceCandidate(candidate: RTCIceCandidate): Promise<void> {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }

        try {
            // Check if we have a remote description yet
            if (!this.hasRemoteDescription) {
                console.log('Queuing ICE candidate until remote description is set');
                this.pendingIceCandidates.push(candidate);
                return;
            }

            await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('ICE candidate added successfully');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }

    private async processPendingIceCandidates(): Promise<void> {
        if (!this.peer || !this.hasRemoteDescription) return;

        console.log(`Processing ${this.pendingIceCandidates.length} pending ICE candidates`);

        for (const candidate of this.pendingIceCandidates) {
            try {
                await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('Pending ICE candidate added successfully');
            } catch (error) {
                console.error('Error adding pending ICE candidate:', error);
            }
        }

        // Clear the queue
        this.pendingIceCandidates = [];
    }

    sendStream(stream: MediaStream): void {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }

        // Consistent approach to track addition
        const senders = this.peer.getSenders();
        const audioSenders = senders.filter(s => s.track && s.track.kind === 'audio');
        const videoSenders = senders.filter(s => s.track && s.track.kind === 'video');

        // Process tracks by type to maintain ordering
        stream.getTracks().forEach(track => {
            console.log("Processing track:", track.kind, track.id);

            if (track.kind === 'audio') {
                if (audioSenders.length > 0) {
                    // Replace existing audio track
                    console.log("Replacing existing audio track");
                    audioSenders[0].replaceTrack(track);
                } else {
                    // Add new audio track
                    console.log("Adding new audio track");
                    this.peer?.addTrack(track, stream);
                }
            } else if (track.kind === 'video') {
                if (videoSenders.length > 0) {
                    // Replace existing video track
                    console.log("Replacing existing video track");
                    videoSenders[0].replaceTrack(track);
                } else {
                    // Add new video track
                    console.log("Adding new video track");
                    this.peer?.addTrack(track, stream);
                }
            }

            this.streamCleanupCallbacks.push(() => track.stop());
        });
    }

    setupRemoteStreamHandler(onTrackCallback: (stream: MediaStream) => void): void {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }

        this.peer.ontrack = (event) => {
            if (event.streams && event.streams.length > 0) {
                console.log('Received remote stream:', event.streams[0].id);
                onTrackCallback(event.streams[0]);
            }
        };
    }

    cleanup(): void {
        console.log("Performing thorough cleanup");

        // Close all tracks
        this.streamCleanupCallbacks.forEach(callback => callback());
        this.streamCleanupCallbacks = [];

        if (this.peer) {
            // Remove all event listeners
            if (this.peer.onicecandidate) this.peer.onicecandidate = null;
            if (this.peer.ontrack) this.peer.ontrack = null;
            if (this.peer.oniceconnectionstatechange) this.peer.oniceconnectionstatechange = null;
            if (this.peer.onicegatheringstatechange) this.peer.onicegatheringstatechange = null;
            if (this.peer.onsignalingstatechange) this.peer.onsignalingstatechange = null;

            // Stop and remove all tracks
            this.peer.getSenders().forEach(sender => {
                if (sender.track) {
                    sender.track.stop();
                }
            });

            // Close and nullify the connection
            this.peer.close();
            this.peer = null;
        }

        // Reset state variables
        this.pendingIceCandidates = [];
        this.hasRemoteDescription = false;
    }
}

const peerService = new PeerService();
export default peerService;