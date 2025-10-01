import useAuth from "../hooks/useAuth";
import {  useState } from "react";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";
const Register = () => {
  const navigate = useNavigate();
  const {register} = useAuth();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmpassword, setConfirmPassword] = useState(null);
  return (
    <main className="flex flex-row h-screen bg-black/50">
      <div className="  w-1/2 h-screen overflow-y-hidden">
          <img src="register.jpg" alt="chess" className="h-screen w-full"  />
      </div>
      <div className=" flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-black justify-evenly p-6 items-center justify-center w-1/2 h-screen">
        <HomeButton/>
        <h1 className="text-7xl font-semibold ">Register</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if(password!=confirmpassword){
              toast.error("Passwords are not same")
            }
            else
            register(username, password);
          }}
          className="flex flex-col mt-6 p-10 border border-2 font-medium"
        >
          <input 
            className="border border-2 m-3 font-2xl py-8 px-6"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
          ></input>
          <input 
            className="border border-2 m-3 font-2xl py-10 px-6"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          ></input>
          <input 
            className="border  border-2 m-3 font-2xl py-10 px-6"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          ></input>
          <button
            className="border cursor-pointer bg-zinc-800 border-2 m-5 font-2xl py-10 px-6"
          >Submit</button>
          <div>
            Already have an account ? <span className="underline cursor-pointer"
            onClick={()=>{navigate("/login")}}>Login</span>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
