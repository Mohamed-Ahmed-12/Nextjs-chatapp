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

export const fetchUserProfile = async (uid: string): Promise<any> => {
    try {
        const res = await axiosInstance.get(`user/${uid}/profile/`)
        return res.data
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const UpdateUserProfile = async (uid: string, data: any): Promise<any> => {
    try {
        const res = await axiosInstance.put(`user/${uid}/profile/`, data)
        return res.data
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export const changePassword = async (uid: string, oldPass: string, newPass: string): Promise<any> => {
    const data = { "old_password": oldPass, "new_password": newPass }
    try {
        const res = await axiosInstance.put(`user/${uid}/changepassword/`, data)
        return res.data
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const fetchLanguages = async (): Promise<any> => {
    try {
        const res = await axiosInstance.get('languages/')
        return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

