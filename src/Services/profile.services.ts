import axios from "axios";
import type { PostCardInterface } from "../types/PostCard.types";

const baseUrl = import.meta.env.VITE_BASE_URL;

type BookmarkedPostsResponse = {
  data: {
    bookmarks: PostCardInterface[];
  };
};

export async function getMyProfile() {
  const data = await axios.get(`${baseUrl}/users/profile-data`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });

  return data;
}

export async function getBookmarkedPosts() {
  const response = await axios.get<BookmarkedPostsResponse>(
    `${baseUrl}/users/bookmarks`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return response.data.data.bookmarks;
}
