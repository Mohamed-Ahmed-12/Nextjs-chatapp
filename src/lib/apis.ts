import { axiosInstance } from "./network"

export const fetchUserRooms = async (uid: number): Promise<any> => {
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

export const fetchUserProfile = async (uid: number): Promise<any> => {
    try {
        const res = await axiosInstance.get(`user/${uid}/profile/`)
        return res.data
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const UpdateUserProfile = async (uid: number, data: any): Promise<any> => {
    try {
        const res = await axiosInstance.put(`user/${uid}/profile/`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
        return res.data
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const changePassword = async (uid: number, oldPass: string, newPass: string): Promise<any> => {
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

export const changeUserPivacy = async (data: any) => {
    const { is_searchable } = data;
    try {
        await axiosInstance.post('user/privacy/', { is_searchable });
    } catch (err) {
        console.error("Failed to update privacy setting:", err);
        throw err;
    }
}

