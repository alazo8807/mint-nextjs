'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    // Here you would typically send the data to your backend API
    console.log(values)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 5000))
    setIsLoading(false)
    // Redirect to dashboard or show success message
    router.push('/transactions')
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text text-gray-600">Email</span>
            </label>
            <Field name="email" type="email" placeholder="john@example.com" className="input input-bordered bg-white text-gray-600" />
            {errors.email && touched.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text text-gray-600">Password</span>
            </label>
            <Field name="password" type="password" placeholder="********" className="input input-bordered bg-white text-gray-600" />
            {errors.password && touched.password && <div className="text-error text-sm mt-1">{errors.password}</div>}
          </div>

          <button type="submit" className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </Form>
      )}
    </Formik>
  )
}

