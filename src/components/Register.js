import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loader, setLoader] = useState(false)
  const [err, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.username === "" || inputs.email === "" || inputs.password === "") { return alert("Please fill all details properly") }
    setLoader(true);
    try {
      let response = await axios.post("https://taskboard-server.vercel.app/api/register", inputs);
      setLoader(false); navigate("/login"); setTimeout(() => {
        alert(response.data.message);
      }, 1500);
    } catch (err) {
      console.log(err); setLoader(false);
      setError(err.response.data.message);
    }
  };

  return (
    <div className='py-10 flex flex-col gap-3 items-center'>
      <h1 className='sm:text-2xl text-base font-medium'>Register</h1>
      <form className='p-8 bg-sky-100 flex rounded-sm flex-col gap-4 shadow-lg border border-slate-300'>
        <div>
          <label className='text-sm font-bold' htmlFor="username">Username</label>
          <input className='border text-md sm:w-[300px] w-[250px] rounded-md shadow-md p-1 block border-slate-200' type="text" placeholder="username" name="username" onChange={handleChange} />
          <p className="text-xs text-zinc-500 px-2">Remember your username for sign in..</p>
        </div>
        <div>
          <label className='text-sm font-bold' htmlFor="email">Email</label>
          <input className='border text-md sm:w-[300px] w-[250px] rounded-md shadow-md p-1 block border-slate-200' type="email" placeholder="email" name="email" onChange={handleChange} />
        </div>
        <div>
          <label className='text-sm font-bold' htmlFor="password">Password</label>
          <input className='border text-md sm:w-[300px] w-[250px] rounded-md shadow-md p-1 block border-slate-200' type="password" placeholder="password" name="password" onChange={handleChange} />
        </div>
        {loader ?
          <button disabled={true} className='w-full py-2 mt-3 text-medium text-white rounded-md text-md bg-slate-400 text-center' onClick={(e) => { handleSubmit(e) }}>Loading..</button>
          :
          <button className='w-full py-2 mt-3 text-medium text-white rounded-md text-md bg-sky-400 text-center' onClick={(e) => { handleSubmit(e) }}>Register</button>
        }
        {err && <p className="text-red-600 text-sm font-semibold">{err}</p>}
        <span>
          Do you have an account? <Link className="text-sky-500" to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;