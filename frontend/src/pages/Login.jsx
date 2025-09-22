import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
const Login = () => {
  const [isLoggedIn,  login] = useAuth();
  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  return (
    <main className="flex flex-row h-screen bg-black/50">
      <div className=" flex flex-col items-center justify-center w-1/2 h-screen">
        <h1 className="text-7xl font-semibold ">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(username, password);
          }}
          className="flex flex-col mt-6 p-10 border border-2 font-medium"
        >
          <input 
            className="border border-2 m-3 font-2xl py-10 px-6"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
          ></input>
          <input 
            className="border border-2 m-3 font-2xl py-10 px-6"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          ></input>
          <button
            className="border bg-zinc-800 border-2 m-5 font-2xl py-10 px-6"
          >Submit</button>
        </form>
      </div>
      <div className="  w-1/2 h-screen overflow-y-hidden">
          <img src="chess-bg.jpg" alt="chess" className="h-screen w-full"  />
      </div>
    </main>
  );
};

export default Login;
