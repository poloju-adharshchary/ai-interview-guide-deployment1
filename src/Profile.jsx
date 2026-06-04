import { useState, useEffect } from "react";

function Profile() {
  
  const [photoPreview, setPhotoPreview] =
  useState(
    localStorage.getItem(
      "profile_photo"
    ) || ""
  );
  useEffect(() => {

  loadProfile();

}, []);

const loadProfile = async () => {

  const res = await fetch(
    `http://localhost:8000/user-profile/${userId}`
  );

  const data =
    await res.json();

  if (
    data.success &&
    data.user.profile_photo
  ) {

    setPhotoPreview(
      data.user.profile_photo
    );

  }
};

  const userName =
    localStorage.getItem("user_name");

  const userId =
    localStorage.getItem("user_id");
  const [name, setName] = useState(
  localStorage.getItem("user_name") || ""
);

const [email, setEmail] = useState(
  localStorage.getItem("user_email") || ""
);

const [oldPassword, setOldPassword] =
  useState("");

const [newPassword, setNewPassword] =
  useState("");

const [message, setMessage] =
  useState("");

const [photo, setPhoto] =
  useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#8b5cf6",
          textShadow: "0 0 20px #8b5cf6",
          marginBottom: "30px",
        }}
      >
        My Profile
      </h1>

      <div
        style={{
          background: "#111827",
          borderRadius: "20px",
          padding: "30px",
          border: "1px solid #8b5cf6",
          boxShadow: "0 0 30px rgba(139,92,246,.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
          }}
        >
          <div
  style={{
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    overflow: "hidden",
    background: "#8b5cf6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {photoPreview ? (
    <img
      src={photoPreview}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  ) : (
    <span
      style={{
        fontSize: "35px",
        fontWeight: "bold",
      }}
    >
      {userName?.charAt(0)}
    </span>
  )}
</div>
          <input
  type="file"
  accept="image/*"
  onChange={(e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = async () => {

  const base64 =
    reader.result;

  setPhotoPreview(base64);

  localStorage.setItem(
    "profile_photo",
    base64
  );

  await fetch(
    "http://localhost:8000/update-profile-photo",
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        user_id: Number(userId),
        photo: base64,
      }),
    }
  );

};

    reader.readAsDataURL(
      file
    );
  }}
/>

          <div>
            <h2>{userName}</h2>
            <p>User ID: {userId}</p>
            <p>Email: {email}</p>
            <p>AI Interview Simulator Member</p>
          </div>
        </div>

        <hr
          style={{
            margin: "30px 0",
            borderColor: "#374151",
          }}
        />

        <h3>Change Password</h3>

<input
  type="password"
  placeholder="Current Password"
  value={oldPassword}
  onChange={(e) =>
    setOldPassword(e.target.value)
  }
/>

<input
  type="password"
  placeholder="New Password"
  value={newPassword}
  onChange={(e) =>
    setNewPassword(e.target.value)
  }
/>

<button
  onClick={async () => {

    const res = await fetch(
      "http://localhost:8000/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          old_password:
            oldPassword,
          new_password:
            newPassword,
        }),
      }
    );

    const data =
      await res.json();

    setMessage(
      data.message
    );

  }}
>
  Change Password
</button>

<p>{message}</p>

      <div
  style={{
    marginTop: "30px",
    background: "#1f2937",
    padding: "25px",
    borderRadius: "15px",
  }}
>
  <h2>Profile Information</h2>

  <input
    value={name}
    onChange={(e) =>
      setName(e.target.value)
    }
    placeholder="Full Name"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "15px",
      borderRadius: "10px",
    }}
  />

  <input
  value={email}
  disabled
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "10px",
    background: "#374151",
    color: "white",
  }}
/>

  <button
    style={{
      marginTop: "20px",
      padding: "12px 20px",
      background: "#8b5cf6",
      border: "none",
      color: "white",
      borderRadius: "10px",
      cursor: "pointer",
    }}
  >
    Save Profile
  </button>
</div>

<div
  style={{
    marginTop: "25px",
    background: "#111827",
    padding: "25px",
    borderRadius: "15px",
  }}
>
  <h2>Change Password</h2>

  <input
    type="password"
    placeholder="Old Password"
    value={oldPassword}
    onChange={(e) =>
      setOldPassword(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "15px",
    }}
  />

  <input
    type="password"
    placeholder="New Password"
    value={newPassword}
    onChange={(e) =>
      setNewPassword(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "15px",
    }}
  />

  <button
    style={{
      marginTop: "20px",
      padding: "12px 20px",
      background: "#8b5cf6",
      border: "none",
      color: "white",
      borderRadius: "10px",
    }}
  >
    Change Password
  </button>
</div>
      </div>
    </div>
  );
}

export default Profile;