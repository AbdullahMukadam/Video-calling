import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCall } from "@/Context/callContextProvider";
import { handleRoomCreation, handleRoomJoining } from "@/Socket";
import { ClipboardWithIcon } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
    open: boolean;
    setopen: (open: boolean) => void;
    dialogmethod: string;
    userId: number | undefined;
    userEmail: string | undefined;
}

export function CustomDialog({ open, setopen, dialogmethod, userId, userEmail }: Props) {
    const [roomIdgenerated, setroomIdGenerated] = useState(false);
    const [RoomId, setroomId] = useState("");
    const { roomId, setRoomId, setMyId, setMySocketId } = useCall();
    const navigate = useNavigate();
    const stringId = String(userId)

    const handleSubmission = async () => {
        const res = await handleRoomCreation(stringId, userEmail, {
            setRoomId,
            setMyId,
            setMySocketId,
        });

        if (res === "success") {
            toast("Room Created Successfully");
            setroomIdGenerated(true);
        } else {
            toast(res);
        }
    };

    const handleJoinSubmission = async () => {
        if (RoomId === "") {
            toast("Please enter a room ID");
            return;
        }

        const res = await handleRoomJoining(RoomId, stringId, userEmail);

        if (res === "success") {
            toast("You'll be joining the room shortly, please wait");
            navigate(`/call/${RoomId}`);
            setopen(false);
        } else {
            toast(res);
        }
    };

    if (dialogmethod === "start") {
        return (
            <Dialog open={open} onOpenChange={setopen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Room Id</DialogTitle>
                        <DialogDescription>
                            Generate room Id by clicking the generate button.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 grid-rows-1 items-center justify-center gap-4">
                            <div className="w-full p-2 flex items-center">
                                <Input
                                    id="roomId"
                                    className="w-[90%] inline-block"
                                    disabled={roomIdgenerated}
                                    value={roomId || ""}
                                />
                                <ClipboardWithIcon
                                    className="inline-block"
                                    valueToCopy={roomId || ""}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        {roomId ? (
                            <Button onClick={() => {
                                navigate(`/call/${roomId}`);
                                setopen(false);
                            }}>
                                Join Call
                            </Button>
                        ) : (
                            <Button type="submit" onClick={handleSubmission}>
                                Generate room Id
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setopen}>
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
                        <Input
                            id="roomId"
                            className="col-span-3"
                            value={RoomId}
                            onChange={(e) => setroomId(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleJoinSubmission}>
                        Join Room
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}