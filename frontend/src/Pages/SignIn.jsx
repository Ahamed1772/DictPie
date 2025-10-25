import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../lib/api.js';
import GoogleAuth from "../Components/OAuthGoogle.jsx";

export default function SignInPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [inputs, setInputs] = useState({ name:"", email:"", password:"", confirmPassword:"", phoneNumber:"" });

  const { mutate, isPending } = useMutation({
    mutationFn: async() => await signUp(inputs),
    onSuccess: () => {
      toast.success("Successfully Signed Up");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate('/verify/email');
    },
    onError: (err) => toast.error(err?.response?.data?.message || "SignUp failed")
  });

  const handleSignUp = (e) => { e.preventDefault(); mutate(); }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-yellow-100 rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-yellow-800 mb-6">
          DictPie
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={inputs.name}
            onChange={(e)=>setInputs({...inputs,name:e.target.value})}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={inputs.email}
            onChange={(e)=>setInputs({...inputs,email:e.target.value})}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <PhoneInput
            country={"in"}
            value={inputs.phoneNumber}
            onChange={(value)=>setInputs({...inputs,phoneNumber:value})}
            inputClass="!w-full !py-2 !px-3 !rounded-lg !border focus:!ring focus:!ring-blue-200"
            buttonClass="!rounded-l-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={inputs.password}
            onChange={(e)=>setInputs({...inputs,password:e.target.value})}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={inputs.confirmPassword}
            onChange={(e)=>setInputs({...inputs,confirmPassword:e.target.value})}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isPending ? "Signing up..." : "SignUp"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm sm:text-base">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <GoogleAuth />
        </div>
      </div>
    </div>
  );
}
