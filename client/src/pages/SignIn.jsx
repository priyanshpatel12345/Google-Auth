import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import OAuth from "../components/OAuth";

function SingUp() {
  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      dispatch(signInStart());
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Data", data);

      if (response.ok) {
        toast.success("Register successful");
        dispatch(signInSuccess(data));
        navigate("/");
      }

      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleInput}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleInput}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 py-5">
        <p>Dont Have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-600 hover:opacity-70">Sign up</span>
        </Link>
      </div>

      <div>
        <p className="text-red-600 py-1">{error ? error.message : ""}</p>
      </div>
    </div>
  );
}

export default SingUp;
