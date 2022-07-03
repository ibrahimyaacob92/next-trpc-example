import { useRouter } from "next/router";
import { useQuery } from "../../utils/trpc";

function PostListingPage() {
  const { data, isLoading } = useQuery(["post.post"]);
  const router = useRouter();
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data?.map((post) => {
        return (
          <article
            key={post.id}
            onClick={() => router.push(`/post/${post.id}`)}
          >
            <p>{post.title}</p>
            <p>{post.user.name}</p>
            <p>{post.createdAt.toUTCString()}</p>
            <hr />
          </article>
        );
      })}
    </div>
  );
}
export default PostListingPage;
