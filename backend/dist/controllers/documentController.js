import { randomUUID } from "crypto";
import { Liveblocks } from "@liveblocks/node";
export const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
});
export const createDocument = async (req, res) => {
    try {
        const { userId, email } = req.params;
        const roomId = randomUUID();
        const metadata = {
            creatorId: userId,
            email: email,
            title: "Untitled",
        };
        const usersAccesses = {
            [email]: ["room:write"],
        };
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ["room:write"],
            //   groupsAccesses: {
            //     "my-group-id": ["room:write"],
            //   },
        });
        res.status(200).json({
            message: "Room Created successfully",
            data: room,
        });
        return;
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error happend while creating a room : ", error });
        return;
    }
};
export const getDocument = async (req, res) => {
    try {
        const { roomId, userId } = req.params;
        const room = await liveblocks.getRoom(roomId);
        const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        if (!hasAccess) {
            res.status(403).json({ message: "You don't have access to this room" });
            return;
        }
        res.status(200).json({ message: "Room fetched successfully", data: room });
        return;
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error happend while getting a room" + error });
        return;
    }
};
export const updateDocumentTitle = async (req, res) => {
    try {
        const { roomId, title } = req.params;
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title: title,
            },
        });
        res
            .status(200)
            .json({ message: "Room title updated successfully", data: updatedRoom });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Error happend while updating title of a room" + error,
        });
        return;
    }
};
export const getDocumentsByUserEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const { limit, page } = req.query;
        const skipAmount = (Number(page) - 1) * Number(limit);
        // Fetch the rooms response from Liveblocks API
        const roomsResponse = await liveblocks.getRooms({
            userId: email,
        });
        // Sort and paginate the data array
        const rooms = roomsResponse.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // .slice(skipAmount, skipAmount + Number(limit));
        // Count total rooms
        const totalRoomsShowedByUser = roomsResponse?.data?.length;
        const response = {
            rooms: rooms,
            totalPage: Math.ceil(totalRoomsShowedByUser / Number(limit)),
            totalRoomsSaved: totalRoomsShowedByUser,
        };
        res.status(200).json(response);
        return;
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error happened while getting rooms" + error });
        return;
    }
};
export const deleteDocument = async (req, res) => {
    try {
        const { roomId } = req.params;
        const deletedRoom = await liveblocks.deleteRoom(roomId);
        res
            .status(200)
            .json({ message: "Room deleted successfully", data: deletedRoom });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Error happend while deleting the room" + error,
        });
        return;
    }
};
export const getDocumentUsers = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { text } = req.query;
        if (!req.user) {
            res.status(400).send("user not found");
            return;
        }
        const room = await liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter((email) => email !== req.user.email);
        if (typeof text === "string" && text.trim().length > 0) {
            const filteredUsers = users.filter((email) => email.toLowerCase().includes(text.toLowerCase()));
            res.status(200).json({
                message: "Users fetched successfully",
                roomUsers: filteredUsers,
            });
            return;
        }
        res
            .status(200)
            .json({ message: "Users fetched successfully", roomUsers: users });
        return;
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error happened while getting doucment users" + error });
        return;
    }
};
export const updateDocumentAccess = async (req, res) => {
    try {
        const { roomId, email, userType } = req.params;
        const { updatedBy } = req.body;
        const usersAccesses = {
            [email]: userType === "creator" || userType === "editor"
                ? ["room:write"]
                : ["room:read", "room:presence:write"],
        };
        const room = await liveblocks.updateRoom(roomId, { usersAccesses });
        if (room) {
            const notificationId = randomUUID();
            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: '$documentAccess',
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `You have been granted ${userType} access to the doucment by ${updatedBy.name}`,
                    updatedBy: updatedBy.name,
                    avatar: `${process.env.NEXT_PUBLIC_BASE_URL}${updatedBy.avatar.substring(updatedBy.avatar.lastIndexOf("/") + 1)}`,
                    email: updatedBy.email
                },
                roomId
            });
        }
        res.status(200).json({
            message: "Document access updated successfully",
            room: room,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened while updating document access" + error,
        });
        return;
    }
};
export const removeCollaborator = async (req, res) => {
    try {
        const { roomId, email } = req.params;
        const room = await liveblocks.getRoom(roomId);
        if (room.metadata.email === email) {
            res.status(400).send("You cannot remove yourself from the document");
        }
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null,
            },
        });
        res.status(200).json({
            message: "Document access updated successfully",
            room: updatedRoom,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error happened while removing collaborator" + error });
        return;
    }
};
