import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <div>{JSON.stringify(error)}</div>;
  // }

  return <div>Welcome</div>;
};

export default Home;
