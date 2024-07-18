import React, { useState } from "react";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

function SingUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError(false);
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Data", data);
      setLoading(false);

      if (response.ok) {
        navigator("/sign-in");
      }

      if (data.success === false) {
        setError(true);
        return;
      }
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleInput}
        />

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
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 py-5">
        <p>Have an account? </p>
        <Link to="/sign-in">
          <span className="text-blue-600 hover:opacity-70">Sign in</span>
        </Link>
      </div>

      <div>
        <p className="text-red-600 py-1">{error && "Something went Wrong"}</p>
      </div>
    </div>
  );
}

export default SingUp;
