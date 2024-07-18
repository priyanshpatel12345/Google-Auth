import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { nanoid } from "@reduxjs/toolkit";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} from "../redux/user/userSlice";

function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [image, setImage] = useState(undefined);
  const [imageProgress, setImageProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = nanoid() + image.name; // *********
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageProgress(Math.floor(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("data");

      const data = await response.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      if (response.ok) {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      }
    } catch (error) {
      dispatch(updateUserSuccess(data));
      console.log(error);
    }
  };

  // ----------------------
  // Delete User Logic
  // ----------------------

  const handleDelete = async (req, res) => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (error) {
      console.log(error);
    }
  };

  // ----------------------
  // SignOut User Logic
  // ----------------------

  const handleSignOut = async (req, res) => {
    try {
      await fetch("api/user/signOut", {
        method: "GET",
      });
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          src={formData.profilePicture || currentUser.profilePicture}
          alt="Profile_Picture"
          onClick={() => fileRef.current.click()}
        />

        <p className="text-sm self-center font-bold">
          {imageError ? (
            <span className="text-red-600">
              Error uploading Image (file size must be less than 2 MB)
            </span>
          ) : imageProgress > 0 && imageProgress < 100 ? (
            <span className="text-slate-700">{`Uploading ${imageProgress} %`}</span>
          ) : imageProgress === 100 ? (
            <span className="text-green-700">Image upload Successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          className="bg-slate-200 rounded-lg p-3 "
          placeholder="Username"
          onChange={handleInput}
        />

        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          className="bg-slate-200 rounded-lg p-3 "
          placeholder="email"
          onChange={handleInput}
        />

        <input
          type="password"
          id="password"
          className="bg-slate-200 rounded-lg p-3  "
          placeholder="password"
          onChange={handleInput}
        />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:placeholder-opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span
          onClick={handleDelete}
          className="text-red-700 font-bold cursor-pointer hover:opacity-75"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700  font-bold cursor-pointer hover:opacity-75"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went Wrong"}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "User is updated Successfully!"}
      </p>
    </div>
  );
}

export default Profile;
