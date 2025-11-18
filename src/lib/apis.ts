import { axiosInstance } from "./network"

export const fetchUserRooms = async (uid: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(`user/${uid}/rooms/`)
        return response.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export const fetchRoomMessage = async (
    roomId: string,
    cursor: string | null = null
): Promise<any> => {
    try {
        const url = cursor == null ? `messages/room/${roomId}/` : `messages/room/${roomId}/?cursor=${cursor}`
        const response = await axiosInstance.get(url)
        console.log(response.data)
        return response.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}