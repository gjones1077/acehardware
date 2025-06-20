import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const Auth = () => {
    return (
        <>
            <input placeholder="Email..."/>
            <input placeholder="Password..."/>
            <button>Sign In</button>
        </>
    )
}