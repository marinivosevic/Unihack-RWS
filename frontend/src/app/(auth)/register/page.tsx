'use client'
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { logo } from '@/app/constants/images'

const StepOneSchema = Yup.object().shape({
    first_name: Yup.string().required('Required'),
    last_name: Yup.string().required('Required'),
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string().required('Required'),
})


const initialValues = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
}
const StepOne = () => (
    <div>
        <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700"
        >
            First Name
        </label>
        <Field
            type="text"
            name="first_name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="first_name"
            component="div"
            className="text-red-500 text-sm"
        />
        <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
        >
            Last Name
        </label>
        <Field
            type="text"
            name="last_name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="last_name"
            component="div"
            className="text-red-500 text-sm"
        />
        <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
        >
            Email
        </label>
        <Field
            type="text"
            name="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="email"
            component="div"
            className="text-red-500 text-sm"
        />

        <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
        >
            Password
        </label>
        <Field
            type="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="password"
            component="div"
            className="text-red-500 text-sm"
        />

        <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
        >
            Confirm password
        </label>
        <Field
            type="password"
            name="confirmPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="confirmPassword"
            component="div"
            className="text-red-500 text-sm"
        />
    </div>
)

interface FormData {
    email: string
    password: string
    first_name: string
    last_name: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export default function RegisterPage() {
   
    const router = useRouter()
    const handleSubmit = async (values: FormData) => {
     

        try {
           
          

   
            const formData: FormData = {
                email: values.email,
                password: values.password,
                first_name: values.first_name,
                last_name: values.last_name,
               
            }
            console.log(formData)
            // Send formData to your backend
            const backendResponse = await fetch(
                'https://lrpedwzxrl.execute-api.eu-central-1.amazonaws.com/api-v1/authentication/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            )
            if (backendResponse.ok) {
                console.log('Success:', backendResponse)
                router.push('/')
            }else{
                console.log('Error:', backendResponse)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }
  

   

    return (
        <div className="flex min-h-screen bg-primary-950">
            <div className="w-full max-w-lg m-auto bg-primary-100 rounded-lg shadow-lg py-12 px-20 ">
                <div className="text-center mb-10">
                    <Image
                        src={logo}
                        alt="Logo"
                        className="mx-auto mb-4"
                        width={80}
                        height={80}
                    />
                    <h1 className="text-3xl font-bold text-primary-900">
                        Register
                    </h1>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={StepOneSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            <StepOne />
                            
                            <div className="flex justify-between">
                               
                                    <Button
                                        variant="custom"
                                        disabled={isSubmitting}
                                        type="submit"
                                    >
                                        Register
                                    </Button>
   
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}