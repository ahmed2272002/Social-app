import { useContext, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { UserContext } from "../Context/UserContext";
import { togglePostLike } from "../../Services/post.services";

type PostLikeButtonProps = {
  postId: string;
  likes: string[];
  className: string;
  onLikeChange: (isLiked: boolean) => void;
};

function PostLikeButton({
  postId,
  likes,
  className,
  onLikeChange,
}: PostLikeButtonProps) {
  const userContext = useContext(UserContext);
  const userId = userContext?.UserDetails?._id ?? userContext?.UserDetails?.id;
  const initialLikeState = userId ? likes.includes(userId) : false;
  const [localLikeState, setLocalLikeState] = useState<boolean | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const isLiked = localLikeState ?? initialLikeState;

  async function handleToggleLike() {
    if (isUpdating) return;

    const nextLikeState = !isLiked;
    setIsUpdating(true);

    try {
      const { data } = await togglePostLike(postId);
      setLocalLikeState(nextLikeState);
      onLikeChange(nextLikeState);
      toast.success(
        typeof data.message === "string"
          ? data.message
          : nextLikeState
            ? "Post liked"
            : "Like removed",
      );
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to update your like. Please try again.";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={isLiked ? "Unlike post" : "Like post"}
      aria-pressed={isLiked}
      disabled={isUpdating}
      onClick={handleToggleLike}
      className={`${className} ${isLiked ? "text-red-600" : "text-black"} disabled:cursor-wait disabled:opacity-60`}
    >
      <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
      {isLiked ? "Likes" : "Like"}
    </button>
  );
}

export default PostLikeButton;
