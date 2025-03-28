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
import { ClipboardWithIcon } from "flowbite-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Props {
    open: boolean;
    setopen: () => void;
    setroomId: () => void;
    roomId: string;
    handleCreateRoom: () => void;
    dialogmethod: string;
    handleJoinRoom: () => void;
    generatedRoomId: string
}
export function CustomDialog({ open, setopen, setroomId, roomId, handleCreateRoom, dialogmethod, handleJoinRoom, generatedRoomId }: Props) {
    const [roomIdgenerated, setroomIdGenerated] = useState(false)
    const navigate = useNavigate()
    const handleSubmission = (): void => {
        handleCreateRoom()
    }

    useEffect(() => {
        if (generatedRoomId === "") {
            setroomIdGenerated(true)
        } else if (generatedRoomId?.length > 0) {
            setroomIdGenerated(false)
        }
    }, [])

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
                        <div className="grid grid-cols-1 grid-rows-1 items-center justify-center gap-4">
                            <div className=" w-full p-2 flex items-center">
                                <Input id="roomId" className=" w-[90%] inline-block" disabled={roomIdgenerated} value={generatedRoomId!}
                                />
                                <ClipboardWithIcon className="inline-block" valueToCopy={generatedRoomId ? generatedRoomId : ""} />

                            </div>

                        </div>
                    </div>
                    <DialogFooter>
                        {generatedRoomId !== "" ? <Button onClick={() => navigate(`/call/${generatedRoomId}`)}>Join Call</Button> : <Button type="submit" onClick={handleSubmission}>Generate room Id</Button>}
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
