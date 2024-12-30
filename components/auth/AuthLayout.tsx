import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthLayout({
  children,
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Full-height image for larger screens */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/signin.webp?height=1080&width=1920"
          alt="Auth background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Auth form section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="card bg-white w-full max-w-md shadow">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-gray-600 text-center mx-auto">
              {title}
            </h2>
            {description && <p className="text-center text-gray-500">{description}</p>}
            {children}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                {footerText}{" "}
                <Link href={footerLinkHref} className="link link-primary">
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Go to home page*/}
        <div className="py-4">
          <Link href={"/"} className="link link-primary">
            <p className="text-sm underline">Go back to home page</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
