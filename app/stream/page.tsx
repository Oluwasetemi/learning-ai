import { Metadata } from "next";
import StreamClient from "./stream-client";

export const metadata: Metadata = {
  title: "Stream Generator",
};

function StreamPage() {
  return <StreamClient />;
}

export default StreamPage;
