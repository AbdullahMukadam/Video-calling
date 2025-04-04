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

    async generateAnswer(offer: RTCSessionDescriptionInit) {
        if (this.peer) {
            await this.peer.setRemoteDescription(offer)
            const answer = await this.peer.createAnswer()
            await this.peer.setLocalDescription(answer)
            return answer
        }
        return undefined
    }

    async setAnswer(answer: RTCSessionDescriptionInit) {
        if (this.peer) {
            await this.peer.setRemoteDescription(answer)
        }
        return undefined
    }

    async iceCandidate(onIceCandidateCallback: (candidate: RTCIceCandidate) => void): Promise<void> {
        if (this.peer) {
            this.peer.onicecandidate = (event) => {
                if (event.candidate) {
                    onIceCandidateCallback(event.candidate);
                }
            };
        }
    }

    async addIceCandidate(candidate: RTCIceCandidate) {
        if (this.peer) {
            await this.peer.addIceCandidate(candidate)
        }
        return undefined
    }
}

const peerService = new PeerService();
export default peerService;