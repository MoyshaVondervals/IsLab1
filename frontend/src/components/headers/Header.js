import AuthorizedHeader from "./authorized-header";
import { useSelector } from "react-redux";
import NotAuthorizedHeader from "./not-authorized-header";
const Header = () => {
    const jwtToken = useSelector((state) => state.auth.token);
    if (jwtToken) {
        return <AuthorizedHeader/>
    }
    return <NotAuthorizedHeader/>
}
export default Header;