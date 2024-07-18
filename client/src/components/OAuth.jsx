import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      // console.log(result);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await response.json();

      dispatch(signInSuccess(data));
      console.log(data);
      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.log("Could not login with google", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="uppercase bg-red-600 text-white p-3 rounded-lg hover:opacity-85"
    >
      Continue with google
    </button>
  );
}
