import { useEffect } from "react";

export default function HomePage() {
  const username = localStorage.getItem("username");

  useEffect(() => {
    
  }, []);

  return (
    <div className="">
      <p className="">Hi, {username}</p>
      <p className="">Product catalog home</p>

    </div>
  );
}