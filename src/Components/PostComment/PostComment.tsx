import { ImagePlus, Send, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { createPostComment } from "../../Services/comment.services";
import toast from "react-hot-toast";
import axios from "axios";

function PostComment({ postId  , getComments}: { postId: string , getComments : (postId : string)=>void }) {
  // body of comment
  const [content, setContent] = useState<string>("");
  // image
  const [image, setImage] = useState<File | null>(null);
  // preview for image
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // function to Submit data
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const { data } = await createPostComment(postId, formData);
      toast.success(data.message);
      getComments(postId);
      setContent("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to post your comment. Please try again.";
      toast.error(message);
    }
  }

  // handle image

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  // clear Form 
  function clearForm(){
    setImagePreview(null)
    setImage(null)
  }

  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  return (
    <>
      <form className="mt-4 flex flex-col gap-2 pb-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2.5">
          <img
            alt="Your profile"
            className="size-8 shrink-0 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&h=96&q=80"
          />
          <div className="flex min-w-0 flex-1 items-center rounded-full bg-gray-100 pr-1.5 focus-within:ring-2 focus-within:ring-blue-200">
            <span className="sr-only">Write a comment</span>
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500"
              id="post-details-comment"
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100">
              <span className="sr-only">Add an image</span>
              <input
                accept="image/*"
                className="sr-only"
                type="file"
                onChange={handleImage}
              />
              <ImagePlus size={16} />
            </label>
            <button
              aria-label="Post comment"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 disabled:text-gray-400 disabled:hover:bg-transparent"
              type="submit"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>

      {imagePreview && (
        <>
          <div className=" relative w-fit">
            <X className=" absolute right-0 top-0 cursor-pointer" onClick={()=> clearForm()} />
            <img src={imagePreview} className="w-50 h-50 object-cover" alt="" />
          </div>
        </>
      )}
    </>
  );
}

export default PostComment;
