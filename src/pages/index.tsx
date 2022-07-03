import type { NextPage } from "next";
import Link from "next/link";
import LoginForm from "../components/LoginForm";
import { useUserContext } from "../context/user.context";
import { useMutation } from "../utils/trpc";

const Home: NextPage = () => {
  const user = useUserContext();
  const { mutate, isLoading, error } = useMutation("users.logout");

  if (!user) {
    return <LoginForm />;
  }
  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <Link href="/post/new">Create Post</Link>
      <button onClick={() => mutate()}>Logout</button>
    </div>
  );
};

export default Home;
