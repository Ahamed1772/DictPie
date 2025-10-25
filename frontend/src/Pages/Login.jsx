import { useState } from "react";
import toast from 'react-hot-toast';
import { axiosInstance } from "../lib/axios";
import GoogleAuth from "../Components/OAuthGoogle";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export default function LoginPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState({ email: "", password: "" });
  const [cookies, setCookie] = useCookies(["jwt"]);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async() => await axiosInstance.post('/auth/login', value),
    onSuccess: (res) => {
      const token = res?.data?.token;
      if (token) {
        setCookie("jwt", token, { path: "/", secure: true, sameSite: "Strict", maxAge: 24*60*60 });
      }
      toast.success("Successfully Logged In");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Login failed");
      console.log(err);
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-yellow-100 rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-yellow-800 mb-6">
          DictPie
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={value.email}
              onChange={(e) => setValue({ ...value, email: e.target.value })}
              placeholder="Enter email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={value.password}
              onChange={(e) => setValue({ ...value, password: e.target.value })}
              placeholder="Enter password"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isPending ? "Logging in..." : "Login"}
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
