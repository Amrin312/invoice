import React, {useState} from 'react'
import { API_PATHS } from '../../utils/apiPaths';
import { useAuth } from "../../context/AuthContext";
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, FileText, Loader2, Lock, Mail, User } from 'lucide-react';
import { validateEmail, validatePassword } from '../../utils/helper';

const SignUp = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const validateName = (name) => {
    if(!name) return "Name is required!";
    if(name.length < 2) return "Name must be atleast 2 characters.";
    if(name.length > 50) return "Name must be less than 60 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if(!confirmPassword) return "Please confirm your password!";
    if(confirmPassword !== password) return "Passwords do not match!";
    return "";
  };

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({...prev, [name]: value}));

    if(touched[name]){
      const newFieldErrors = { ...fieldErrors }

      if(name === 'name'){
        newFieldErrors.name = validateName(value);
      }else if(name === 'email'){
        newFieldErrors.email = validateEmail(value);
      }else if(name === 'password'){
        newFieldErrors.password = validatePassword(value);

        if(touched.confirmPassword){
          newFieldErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, value);
        }
      }else if(name === 'confirmPassword'){
        newFieldErrors.confirmPassword = validateConfirmPassword(value, formData.password);
      }
      setFieldErrors(newFieldErrors);
    }
    
    if(error){
        setError("");
    }

  };

  const handleBlur = (e) => {

    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const newFieldErrors = { ...fieldErrors };

    if(name === 'name'){
      newFieldErrors.name = validateName(formData.name);
    }else if(name === 'email'){
      newFieldErrors.email = validateEmail(formData.email);
    }else if(name === 'password'){
      newFieldErrors.password = validatePassword(formData.password);

      if(touched.confirmPassword){
        newFieldErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
      }
    }else if(name === 'confirmPassword'){
      newFieldErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
    }

    setFieldErrors(newFieldErrors);

  };

  const isFormValid = () => {

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

    return (
      !nameError && !emailError && !passwordError && !confirmPasswordError && formData.name && formData.email && formData.password && formData.confirmPassword
    );

  };

  const handleSubmit = async () => {

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

    if(nameError || emailError || passwordError || confirmPasswordError){

      setFieldErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });

      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true
      });

      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try{

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      );

      const data = response.data;

      const { token } = data;

      if(response.status === 201){

        if(token){
          setSuccess("Account created successfully!");

          setFieldErrors({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
          });

          setTouched({
            name: false,
            email: false,
            password: false,
            confirmPassword: false
          });

          login(data, token);

          navigate("/dashboard");
        
        }else{
          setError(response.data.message || "Invalid credentials!");
        }
      }
    }catch(err){

      if(err.response && err.response.data && err.response.data.message){
          setError(err.response.data.message);
      }else{
        setError("Registration failed. Please try again.");
        console.log(`Error: ${err.message}`);
        
      }

    }finally{
      setIsLoading(false);
    }

  };


  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-sm'>
        {/* header  */}
        <div className='text-center mb-8'>
          <div className='w-12 h-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center '>
            <FileText className='w-6 h-6 text-white' />
          </div>

          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>Create Account</h1>

          <p className='text-gray-600 text-sm'>Join Invoice Generator today</p>
        </div>

        {/* body  */}
        <div className="space-y-4">

          <div className="">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <div className="relative">
              <User className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input type="text" name="name" id="name" required 
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.name && touched.name ? 'border-red-300 focus:ring-red-500': 'border-gray-300 focus:ring-black'}`}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={formData.name}
              placeholder='Enter your full name'
              />
            </div>

            {fieldErrors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div className="">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input type="email" name="email" id="email" required 
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.email && touched.email ? 'border-red-300 focus:ring-red-500': 'border-gray-300 focus:ring-black'}`}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={formData.email}
              placeholder='Enter your email'
              />
            </div>

            {fieldErrors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          
          <div className="">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input type={showPassword ? 'text':'password'} name="password" id="password" required 
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.password && touched.password ? 'border-red-300 focus:ring-red-500': 'border-gray-300 focus:ring-black'}`}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={formData.password
                
              }
              placeholder='Enter your password'
              />

              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>

            {fieldErrors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>


          <div className="">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input type={showConfirmPassword ? 'text':'password'} name="confirmPassword" id="confirmPassword" required 
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:ring-red-500': 'border-gray-300 focus:ring-black'}`}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={formData.confirmPassword}
              placeholder='Confirm your password'
              />

              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff className='w-5 h-5w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5w-5 h-5' />
                )}
              </button>
            </div>

            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
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

            <div className='flex items-start pt-2'>
              <input type="checkbox" name="terms" id="terms" className='w-4 h-4 text-black border-gray-300 rounded focus:ring-black mt-1' />

              <label htmlFor="terms" className='ml-2 text-sm text-gray-600'>I agree to the {" "}
                <button className="text-black hover:underline">Terms of Service</button>
                {" "}
                <button className="text-black hover:underline">Privacy Policy</button>
              </label>
            </div>
            
            <button onClick={handleSubmit} 
            className='w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center group cursor-pointer'
             disabled={isLoading || !isFormValid()}>
              {
                isLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animation-spin' />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </>
                )
              }
            </button>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">Already have an account {" "} 
                <button className='text-black font-medium hover:underline' type="button" onClick={() => navigate('/login')}>
                  Sign In
                </button>
              </p>
            </div>


        </div>

      </div>

    </div>
  )
}

export default SignUp