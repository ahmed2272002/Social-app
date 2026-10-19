import PostCard from "../../Components/PostCard/PostCard";
import Sidebar from "../../Components/Sidebar/Sidebar";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";
import { getUSerFeed } from "../../Services/feed.services";
import type { PostCardInterface } from "../../types/PostCard.types";
import PostSkeleton from "../../Components/PostCard/PostSkeleton";
import CreatePost from "../../Components/PostCard/CreatePost";
import { useQuery } from "@tanstack/react-query";



function NewsFeed() {

    // using tanStack Query

  const {data , isLoading  , isError , error} = useQuery({
    queryKey : ["getFeed"],
    queryFn : ()=>getUSerFeed(),
    select : (data) => data?.data.posts as PostCardInterface[],
    enabled : true ,
    // retry: 3,
    // retryOnMount : false,
    retryDelay: 1000,
    // refetchOnMount : false,
    // refetchOnWindowFocus: false,
    refetchIntervalInBackground: false ,
    staleTime: 4000,

  })

  // const posts : PostCardInterface[] = data?.data.posts




  // const [posts, setPosts] = useState<PostCardInterface[] | []>([]);

  // const [isLoading, setIsLoading] = useState(true)

  // async function getAllPost() {
  //     try {
  //       const { data } = await getUSerFeed();
  //       setPosts(data.data.posts);
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         toast.error(
  //           typeof error.response?.data?.message === "string"
  //             ? error.response.data.message
  //             : "Unable to load posts. Please try again.",
  //         );
  //       } else {
  //         toast.error("Unable to load posts. Please try again.");
  //       }
  //     }
  //     finally{
  //       setIsLoading(false)
  //     }
  //   }

  // useEffect(() => {
  //   getAllPost();
  // }, []);

  return (
    <>
    
      <div className="container mx-auto">
        <title>Home Feed | Social App</title>
        <div className="grid grid-cols-12 gap-4 pt-4">
          <div className="col-span-2">
            <Sidebar />
          </div>
          <div className="col-span-7">
            <CreatePost/>
            
            {
              isError ? <p className="text-red-800 text-center">{error.message}</p> 
              :  isLoading ? <PostSkeleton/> 
              : data?.map((post) => <PostCard  key={post._id}  post = {post} />)
            }
            
          </div>
          <div className="col-span-3">
            <SuggestedFriends />
          </div>
        </div>
      </div>
    </>
  );
}

export default NewsFeed;
