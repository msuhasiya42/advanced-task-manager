import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../Api";
import useAuthStore from "../Store/authStore";
import useTaskStore from "../Store/taskStore";
import { boolean } from "zod";
import { useEffect } from "react";

const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { login, addListOfUser } = useAuthStore();
    const { setTags, updateFilter } = useTaskStore();

    const loginMutation = useMutation(({ email, password }: { email: string, password: string }) => userAPI.login(email, password), {
        onSuccess: (res) => {
            const { tags, filter } = res.data;

            login(res.data);
            queryClient.invalidateQueries("users");

            if (tags) setTags(tags);
            if (filter) updateFilter(JSON.parse(filter));

            // Call fetchUsers after successful login
            fetchUsers();

            navigate("/user-dashboard");

        },
    });

    const googleLoginMutation = useMutation((credential: any) => userAPI.googleLogin(credential), {
        onSuccess: (res) => {
            login(res.data);
            queryClient.invalidateQueries("users");
            // Call fetchUsers after successful login
            fetchUsers();
            navigate("/user-dashboard");
        },

        onError: (err: any) => {
            console.log(err)
        }
    });

    const fetchUsers = async () => {
        await userAPI.getAllUsers().then((res) => {
            addListOfUser(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    return { loginMutation, googleLoginMutation };
};

export default useLogin;
