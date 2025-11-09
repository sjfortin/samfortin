import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <Header />
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto lg:mx-0">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              About Me
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8">
              Welcome to my corner of the web. I'm passionate about building great software and sharing knowledge with the community.
            </p>
          </div>
          
          <div className="mx-auto mt-16 lg:mx-0">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              My Journey
            </h2>
            <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-300">
              I'm a software developer with a passion for creating elegant solutions to complex problems. 
              My journey in tech has been driven by curiosity and a desire to build tools that make a difference.
            </p>
            <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-300">
              Over the years, I've worked on various projects spanning web development, mobile applications, 
              and everything in between. I believe in writing clean, maintainable code and sharing what I learn along the way.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
