export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">My Brand</h1>
          <nav>
            <a href="#about" className="mx-2 hover:underline">About</a>
            <a href="#services" className="mx-2 hover:underline">Services</a>
            <a href="#contact" className="mx-2 hover:underline">Contact</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16">
        <section className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Welcome to My Website</h2>
          <p className="text-lg mb-6">
            Build amazing experiences with our services.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Get Started
          </button>
        </section>
        <section id="about" className="mt-16">
          <h3 className="text-2xl font-bold mb-4">About Us</h3>
          <p>
            We are a team dedicated to providing the best solutions for your business.
          </p>
        </section>
        <section id="services" className="mt-16">
          <h3 className="text-2xl font-bold mb-4">Our Services</h3>
          <ul className="list-disc pl-6">
            <li>Web Development</li>
            <li>Design</li>
            <li>Marketing</li>
          </ul>
        </section>
        <section id="contact" className="mt-16">
          <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
          <p>
            Email us at <a href="mailto:info@mybrand.com" className="text-blue-600 underline">info@mybrand.com</a>
          </p>
        </section>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        &copy; {new Date().getFullYear()} My Brand. All rights reserved.
      </footer>
    </div>
  );
}
