import useAuth from "../hooks/useAuth";

const Profile = () => {
    const {user} = useAuth();
  return (
    <div
        className="min-h-screen bg-cover bg-center relative overflow-auto"
    >   
        <div children="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-black/70" >
        <div className="relative z-10 flex pt-38 justify-center min-h-screen px-4">
    username :  {" "}
        {user.username}
        </div>
        </div>
        </div>
  )
}

export default Profile