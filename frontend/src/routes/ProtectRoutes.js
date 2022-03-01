import { useSelector } from "react-redux"
import { Redirect, Route } from "react-router-dom";
import { authSelector } from "../redux/selectors/authSelector"
import { userSelector } from "../redux/selectors/userSelector";

const ProtectRoutes = ({ isAdmin, component: Component, ...rest }) => {

    const { isAuthenticated } = useSelector(authSelector)
    const { user } = useSelector(userSelector)

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated === false) {
                    return <Redirect to="/account/login" />
                }
                if (user) {
                    if (isAdmin === true && user.role !== 'admin') {
                        return <Redirect to="/" />
                    }
                    return <Component {...props} />
                }
            }
            }
        />
    )

}
export default ProtectRoutes