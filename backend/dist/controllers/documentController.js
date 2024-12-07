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
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        // if (!hasAccess) {
        //   res.status(403).json({ message: "You don't have access to this room" });
        //   return;
        // }
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
