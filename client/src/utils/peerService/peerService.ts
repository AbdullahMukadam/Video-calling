class PeerService {
    peer: RTCPeerConnection | null = null;
    private streamCleanupCallbacks: (() => void)[] = [];

    constructor() {

    }

    createNewConnection() {
        console.log("Creating completely new peer connection");

        // Thorough cleanup of existing connection
        this.cleanup();

        // Create a fresh connection
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302"
                    ]
                }
            ]
        });

        this.setupEventListeners();

        return this.peer;
    }

    private setupEventListeners() {
        if (!this.peer) return;

        this.peer.oniceconnectionstatechange = () => {
            console.log('ICE connection state changed:', this.peer?.iceConnectionState);
        };

        this.peer.onicegatheringstatechange = () => {
            console.log('ICE gathering state changed:', this.peer?.iceGatheringState);
        };

        this.peer.onsignalingstatechange = () => {
            console.log('Signaling state changed:', this.peer?.signalingState);
        };
    }

    async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
        if (!this.peer) {
            console.log('Creating new connection for offer');
            this.createNewConnection();
        }

        try {
            console.log("Creating new offer, current signaling state:", this.peer?.signalingState);

            // Force close and recreate if in wrong state
            if (this.peer?.signalingState !== "stable") {
                console.log("Connection not in stable state, recreating");
                this.cleanup();
                this.peer = new RTCPeerConnection({
                    iceServers: [
                        {
                            urls: [
                                "stun:stun.l.google.com:19302",
                                "stun:global.stun.twilio.com:3478",
                                "stun:stun1.l.google.com:19302",
                                "stun:stun2.l.google.com:19302"
                            ]
                        }
                    ]
                });
                this.setupEventListeners();
            }

            const offer = await this.peer?.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            try {
                await this.peer?.setLocalDescription(offer);
            } catch (error: any) {
                console.error('Error setting local description:', error);

                // Check if this is an m-line order issue
                if (String(error).includes("m-lines")) {
                    console.log("Detected m-line order issue, recreating connection");
                    this.cleanup();
                    return this.getOffer(); // Recursive call with fresh connection
                }
                throw error;
            }

            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            return undefined;
        }
    }

    async generateAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return undefined;
        }

        try {
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error('Error generating answer:', error);
            return undefined;
        }
    }

    async setAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }

        try {
            await this.peer.setRemoteDescription(answer);
        } catch (error) {
            console.error('Error setting answer:', error);
        }
    }

    async iceCandidate(onIceCandidateCallback: (candidate: RTCIceCandidate) => void): Promise<void> {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }

        this.peer.onicecandidate = (event) => {
            if (event.candidate) {
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
            await this.peer.addIceCandidate(candidate);
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }

    sendStream(stream: MediaStream): void {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }


        const existingSenders = this.peer.getSenders();

        stream.getTracks().forEach(track => {
            console.log("Adding track:", track.kind, track.id);


            const trackExists = existingSenders.some(sender =>
                sender.track && sender.track.id === track.id
            );

            if (!trackExists) {
                this.peer?.addTrack(track, stream);

                this.streamCleanupCallbacks.push(() => track.stop());
            } else {
                console.log("Track already exists, skipping:", track.kind, track.id);
            }
        });
    }

    setupRemoteStreamHandler(onTrackCallback: (stream: MediaStream) => void): void {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return;
        }

        this.peer.ontrack = (event) => {
            if (event.streams && event.streams.length > 0) {
                console.log('Received remote stream:', event.streams[0]);
                onTrackCallback(event.streams[0]);
            }
        };
    }

/*     private cleanupTracks(): void {
        if (this.peer) {
            this.peer.getSenders().forEach(sender => {
                this.peer?.removeTrack(sender);
            });
        }


        this.streamCleanupCallbacks.forEach(callback => callback());
        this.streamCleanupCallbacks = [];
    } */

    cleanup(): void {
        console.log("Performing thorough cleanup");

        // Close all tracks
        this.streamCleanupCallbacks.forEach(callback => callback());
        this.streamCleanupCallbacks = [];

        if (this.peer) {
            // Remove all tracks
            this.peer.getSenders().forEach(sender => {
                if (sender.track) {
                    sender.track.stop();
                }
                this.peer?.removeTrack(sender);
            });

            // Close and nullify the connection
            this.peer.close();
            this.peer = null;
        }
    }


}

const peerService = new PeerService();
export default peerService;