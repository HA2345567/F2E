
import {useAuthActions} from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {z} from "zod";

const signInSchema = z.object({
    email:z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

const signUpSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1,"Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

type SignUpData = z.infer<typeof signUpSchema>
type SignInData = z.infer<typeof signInSchema>
export const useAuth =() =>{
    const {signIn , signOut} = useAuthActions()
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)

    const signInForm = useForm<SignInData>({
        resolver : zodResolver(signInSchema),
        defaultValues:{
            email:"",
            password:"",
        }
    })

    const signUpForm = useForm<SignUpData>({
        resolver : zodResolver(signUpSchema),
        defaultValues:{
            firstName:"",
            lastName:"",
            email:"",
            password:"",

        }
    })

    const handleSignIn = async(data: SignInData)=>{
        setLoading(true) 
        try{
            await signIn('password', {
                email: data.email,
                password: data.password,
                flow: 'signIn',
            })
            router.push('/dashboard')
        }catch(error){
            console.error(error)
            signInForm.setError('password', {message: 'Invalid email or password'})
        } finally{
            setLoading(false)
        }

    }

    const handleSignUp = async(data: SignUpData)=>{
        setLoading(true)
        try{
           await signIn('password', {
                email: data.email,
                password: data.password,
                name: `${data.firstName} ${data.lastName}`,
                flow: 'signUp',
            })
            router.push('/dashboard')

        }catch(error){
            console.error(error)
            signUpForm.setError("root", {message: "Failed to create account"})
        }finally{
            setLoading(false)
        }
       
    }
    const handleSignOut = async() =>{
        setLoading(true)
        try{
            await signOut() 
            router.push('/auth/sign-in')      
         }catch(error){
            console.error('Sign out error:', error)
         }
    }
    return{
         signInForm,
         signUpForm,
         handleSignIn,
         handleSignUp,
         handleSignOut,
         isLoading,

    }
}
