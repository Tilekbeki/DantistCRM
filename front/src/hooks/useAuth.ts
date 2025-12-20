import { useSelector } from "react-redux";
import {parseJwt,getCookie} from "./useParseJwt";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";

const useAuth = () => {
    const {user,token, id, isAuth} = useSelector(state=>state.auth);
    const dispatch = useDispatch();
    
           const tokenincookie = getCookie('access_token');
     
    if (tokenincookie && !isAuth) {
        console.log('куки токен' , tokenincookie);

    const data = parseJwt(tokenincookie)
        dispatch(setAuth({
        user: {
          id: data.user_id,
          username: data.sub,
          role: data.role,
        },
        token: tokenincookie,
        isAuth: true
      }))
        console.log('распарщенная дата', data)
    }
    return {
        isAuth,
        user,
        token,
        id
    }
}

export {useAuth}