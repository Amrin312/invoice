import React, {useState} from 'react'
import { API_PATHS } from '../../utils/apiPaths';
import { useAuth } from "../../context/AuthContext";
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, FileText, Loader2, Lock, Mail } from 'lucide-react';
import { validateEmail, validatePassword } from '../../utils/helper';

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: ""
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}));

    if(touched[name]){
      const newFieldErrors = {...fieldErrors};

      if(name === 'email'){
        newFieldErrors.email = validateEmail(value);
      }

      if(name === 'password'){
        newFieldErrors.password = validatePassword(value);
      }

      setFieldErrors(newFieldErrors);

      if(error) setError("");
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

      const newFieldErrors = {...fieldErrors};

      if(name === 'email'){
        newFieldErrors.email = validateEmail(formData.email);
      }

      if(name === 'password'){
        newFieldErrors.password = validatePassword(formData.password);
      }

      setFieldErrors(newFieldErrors);

  };

  const isFormValid = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    return !emailError && !passwordError && formData.email && formData.password;
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if(emailError || passwordError){
      setFieldErrors({
        email: emailError,
        password: passwordError
      });

      setTouched({
        email: true,
        password: true
      });

      return
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);

      if(response.status === 200){
        const {token} = response.data;
        if(token){
          setSuccess("Login successful.");
          login(response.data, token);

          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }else{
          setError(response.data.message || "Invalid credentials!");
        }

      }
    }catch(err){
      if(err.response && err.response.data && err.response.data.message){
          setError(err.response.data.message);
      }else{
        setError("An error occured during login.");
      }
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>
      <div className='w-full max-w-sm'>

        {/* Header  */}
        <div className='text-center mb-8'>
          <div className='w-12 h-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center'>
            <FileText className="text-white w-6 h-6" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Login to Your Account</h1>
          <p className='text-gray-600 text-sm'>Welcome back to Invoice Generator </p>
        </div>

        {/* Body  */}
        <div className='space-y-4'>
          {/* email  */}
          <div className=''>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className='relative'>
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="email" name="email" className="" id="email" onChange={handleInputChange} required onBlur={handleBlur} value={formData.email}

              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.email && touched.email ? "border-red-300 focus-ring-red-500" : "border-gray-300 focus:ring-black"}`} 
              placeholder='Enter Your Email'
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{ fieldErrors.email }</p>
            )}
           </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className='relative'>

                <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />

                <input type={showPassword ? 'text': 'password'} name="password" required value={formData.password}
                 className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.password && touched.password ? "border-red-300 focus-ring-red-500" : "border-gray-300 focus:ring-black"}`} 
                id="password" placeholder='Enter Password' onChange={handleInputChange} onBlur={handleBlur} />

                <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'>
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
                {fieldErrors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{ fieldErrors.password }</p>
                )}
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
            )}

            <button onClick={handleSubmit} disabled={isLoading || !isFormValid}  className='w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center group cursor-pointer'>
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animation-spin' />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>

            {/* footer  */}

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account? { " " }
                <button type="button" className="text-black font-medium hover:underline" onClick={() => navigate("/signup")}>
                  Sign up
                </button>
              </p>
            </div>

        </div>

      </div>
    </div>
  )
}

export default Login