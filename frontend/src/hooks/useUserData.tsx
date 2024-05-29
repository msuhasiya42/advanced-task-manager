import { useQuery } from "react-query";
import { message } from "antd";
import { userAPI } from "../Api";
import useAuthStore from "../Store/authStore";

interface APIError {
    message: string;
}

const useUserData = () => {

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user)?._id : null;
    const { setUser, logout } = useAuthStore();

    const fetchUserData = () => userAPI.getUserData(userId);

    return useQuery(["user", userId], fetchUserData, {
        enabled: !!userId,
        onSuccess: (data) => {
            setUser(data.data);
        },
        onError: (err: APIError) => {
            message.error("Error fetching user data: " + err.message);
            logout();
        },
    });
};

export default useUserData;
