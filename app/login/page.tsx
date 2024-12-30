import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';

export default function LoginPage() {
  return (
    <>
        <AuthLayout
        title="Log in"
        description=""
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerLinkHref="/signup"
        >
        <LoginForm />
        </AuthLayout>
    </>
  )
}

