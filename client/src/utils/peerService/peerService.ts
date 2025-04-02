class PeerService {
    private peer: RTCPeerConnection | null = null;

    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478"
                        ]
                    }
                ]
            });
        }
    }

    async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
        if (this.peer) {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(offer);
            return offer;
        }
        return undefined;
    }
}

const peerService = new PeerService();
export default peerService;