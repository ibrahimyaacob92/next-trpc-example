import type { NextPage } from "next";
import Link from "next/link";
import LoginForm from "../components/LoginForm";
import { useUserContext } from "../context/user.context";

const Home: NextPage = () => {
  const user = useUserContext();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <Link href="/post/new">Create Post</Link>
    </div>
  );
};

export default Home;
