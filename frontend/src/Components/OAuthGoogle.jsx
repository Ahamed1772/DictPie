import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { decodeJwt } from 'jose';
import toast from 'react-hot-toast'


export default function GoogleAuth() {
  const navigate = useNavigate();
  // react-query mutation
  const { mutate } = useMutation({
    mutationFn: async (userData) => {
      // Send extracted Google user info to backend
      return await axiosInstance.post('/auth/googleauth/signUp', userData);
    },
    onSuccess: (res) => {
      toast.success("Successfully Logged In")
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
      console.log(err);
    },
  });

  const handleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;

    // decode JWT to extract id, name, email
    const decoded = decodeJwt(token);

    const userData = {
      id: decoded.sub,      // Google unique ID
      name: decoded.name,   // User’s full name
      email: decoded.email, // Email
    };


    // send to backend
    mutate(userData);
  };

  const handleError = () => {
    console.log("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          text="signin_with"
          shape="pill"
          logo_alignment="center"
        />
      </div>
    </GoogleOAuthProvider>
  );
}
