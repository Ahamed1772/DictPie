import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const EmailVerification = () => {
    const [code, setCode] = useState("");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    //tenstack query
      const { mutate, isPending, error } = useMutation({
        mutationFn: async() => {
          console.log(`this is code ${code}`);
          if (code !== undefined){
            return await axiosInstance.post('/auth/verify/user', {code});
          }
        },
        onSuccess: () => {
              toast.success("Successfully verified the user");
              queryClient.invalidateQueries({ queryKey: ["authUser"] });
              navigate('/dashboard')
            },
             onError: (err) => {
                toast.error(err.message);
            }
      })
      const handleEmailSubmit = (event) => {
        event.preventDefault();
        mutate();
        console.log(error)
      }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
{/* Company Header */}
<h1 className="text-4xl font-extrabold text-indigo-600 mb-12 drop-shadow-md">
DictPie
</h1>

{error && (
  <div className="alert alert-error mb-4">
    <span>{error?.response?.data?.message}</span>
  </div>
)}

{/* Center Card */}
<div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-indigo-200">
<h2 className="text-2xl font-bold text-gray-800 mb-4">
Verify Your Email
</h2>
<p className="text-gray-500 mb-6">
We’ve sent a 6-digit verification code to your email. Enter it below to confirm your account.
</p>


{/* OTP Input */}
<input
type="text"
placeholder="Enter OTP"
maxLength={6}
className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center tracking-widest text-lg font-semibold mb-6"
value={code}
onChange={(event) => setCode(event.target.value)}
/>


{/* Verify Button */}
<button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition duration-200"
onClick={handleEmailSubmit}
>
 {isPending ? (
															<>
																<span className="loading loading-spinner loading-xs"></span>
																	verifying...
															</>
														) : (
														"verify"
														)}
</button>


{/* Extra Info */}
<p className="mt-6 text-sm text-gray-500">
Didn’t receive the code? <a href="#" className="text-indigo-600 hover:underline">Resend</a>
</p>
</div>
</div>
  )
}

export default EmailVerification