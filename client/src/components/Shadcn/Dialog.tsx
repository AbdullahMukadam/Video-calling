import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
    open: boolean;
    setopen: () => void;
    setroomId: () => void;
    roomId: string;
    handleCreateRoom: () => void;
    dialogmethod: string;
    handleJoinRoom: () => void;
}
export function CustomDialog({ open, setopen, setroomId, roomId, handleCreateRoom, dialogmethod, handleJoinRoom }: Props) {

    const handleSubmission = (): void => {
        handleCreateRoom()
    }

    const handleJoinSubmission = (): void => {
        if (roomId === "") {
            return
        }
        handleJoinRoom()
    }
    if (dialogmethod === "start") {
        return (
            <Dialog open={open} onOpenChange={setopen} >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Room Id</DialogTitle>
                        <DialogDescription>
                            Generate room Id by clicking the generate button.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="roomId" className="text-right">
                                RoomId
                            </Label>
                            <Input id="roomId" className="col-span-3" disabled />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmission}>Generate room Id</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setopen} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enter Room Id</DialogTitle>
                    <DialogDescription>
                        Enter here the room Id, to join the call.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="roomId" className="text-right">
                            RoomId
                        </Label>
                        <Input id="roomId" className="col-span-3" value={roomId} onChange={(e) => setroomId(e.target.value)} required />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleJoinSubmission}>Join Room</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
