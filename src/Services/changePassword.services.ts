import axios from "axios";

const BaseUrl = import.meta.env.VITE_BASE_URL;

export async function changePassword(formData: { password: string; newPassword: string;}) {
  const data = await axios.patch(
    `${BaseUrl}/users/change-password`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}
