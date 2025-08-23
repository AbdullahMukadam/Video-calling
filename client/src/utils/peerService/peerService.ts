class PeerService {
    peer: RTCPeerConnection | null = null;
    private streamCleanupCallbacks: (() => void)[] = [];

    constructor() {
        this.initializePeerConnection();
    }

    private initializePeerConnection() {
        if (!this.peer) {
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
                        username: "e7adbfad724d2bcaac9d812f",
                        credential: "ShfjEcpu+uNbnNhO",
                    },
                    {
                        urls: "turn:global.relay.metered.ca:80?transport=tcp",
                        username: "e7adbfad724d2bcaac9d812f",
                        credential: "ShfjEcpu+uNbnNhO",
                    },
                    {
                        urls: "turn:global.relay.metered.ca:443",
                        username: "e7adbfad724d2bcaac9d812f",
                        credential: "ShfjEcpu+uNbnNhO",
                    },
                    {
                        urls: "turns:global.relay.metered.ca:443?transport=tcp",
                        username: "e7adbfad724d2bcaac9d812f",
                        credential: "ShfjEcpu+uNbnNhO",
                    },
                ]
            });


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
    }

    async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
        if (!this.peer) {
            console.error('PeerConnection not initialized');
            return undefined;
        }

        try {
            const offer = await this.peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await this.peer.setLocalDescription(offer);
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

    private cleanupTracks(): void {
        if (this.peer) {
            this.peer.getSenders().forEach(sender => {
                this.peer?.removeTrack(sender);
            });
        }


        this.streamCleanupCallbacks.forEach(callback => callback());
        this.streamCleanupCallbacks = [];
    }

    cleanup(): void {
        this.cleanupTracks();

        if (this.peer) {
            this.peer.close();
            this.peer = null;
        }
    }


}

const peerService = new PeerService();
export default peerService;