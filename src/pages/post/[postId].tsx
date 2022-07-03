import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "../../utils/trpc";

function SinglePostPage() {
  const router = useRouter();

  const postId = router.query.postId as string;

  const { data, isLoading, error } = useQuery(["post.single-post", { postId }]);

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (error || !data) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <p>{data?.title}</p>
      <p>{data?.body}</p>
      <p>{data?.createdAt.toUTCString()}</p>
      <p>{data?.user.name}</p>

      <Link href="/post">Back To Posts</Link>
    </div>
  );
}

export default SinglePostPage;
