import { useQuery } from "react-query";
import { message } from "antd";
import { userAPI } from "../Api";
import { setUser, logout } from "../Store/reducers/authSlice";
import { useDispatch } from "react-redux";

interface APIError {
    message: string;
}

const useUserData = () => {

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user)?._id : null;
    const dispatch = useDispatch();

    const fetchUserData = () => userAPI.getUserData(userId);

    return useQuery(["user", userId], fetchUserData, {
        enabled: !!userId,
        onSuccess: (data) => {
            dispatch(setUser(data.data));
        },
        onError: (err: APIError) => {
            message.error("Error fetching user data: " + err.message);
            dispatch(logout());
        },
    });
};

export default useUserData;
