'use client'

import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Header } from "@/components/layout/Header"

const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
})

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: { name: string; email: string }) => {
    setIsLoading(true)
    // Here you would typically send the data to your backend API
    console.log(values)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
          <div className="card-body">
            <h2 className="card-title">Profile</h2>
            <p className="text-base-content/70">Manage your account details here.</p>
            <Formik
              initialValues={{ name: 'John Doe', email: 'john@example.com' }}
              validationSchema={ProfileSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-8">
                  <div className="form-control">
                    <label className="label" htmlFor="name">
                      <span className="label-text">Name</span>
                    </label>
                    <Field name="name" type="text" placeholder="John Doe" className="input input-bordered" />
                    {errors.name && touched.name && <div className="text-error text-sm mt-1">{errors.name}</div>}
                    <p className="text-sm text-base-content/70 mt-1">
                      This is the name that will be displayed on your profile and in emails.
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="email">
                      <span className="label-text">Email</span>
                    </label>
                    <Field name="email" type="email" placeholder="john@example.com" className="input input-bordered" />
                    {errors.email && touched.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                    <p className="text-sm text-base-content/70 mt-1">
                      This email will be used for important notifications.
                    </p>
                  </div>

                  <button type="submit" className={`btn btn-primary ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save changes'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </div>
  )
}

