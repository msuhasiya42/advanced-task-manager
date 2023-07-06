import React, { ReactNode, useEffect } from "react";
import useAuthStore from "../../Zustand/authStore";
import { Navigate } from "react-router-dom";
interface ChildrenProp {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ChildrenProp) => {
  const user = useAuthStore((state) => state.user);

  // const token = useAuthStore((state) => state.user.token);
  // const [authenticated, setAuthenticated] = useState(false);
  // useEffect(() => {
  //   verifyToken(token)
  //     .then((res) => {
  //       setAuthenticated(true);
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // if (!authenticated) {
  //   return <Navigate to="/" replace />;
  // }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;
