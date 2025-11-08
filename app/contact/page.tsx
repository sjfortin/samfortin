import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
    return (
        <>
            <Header />
            <div>
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                            Get in Touch
                        </h1>
                        <p className="mt-8 text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8">
                            Have a project in mind or just want to chat? I'd love to hear from you.
                        </p>
                        <div className="mt-6 space-y-4">
                            <p className="text-base/7 text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">Email:</span>{' '}
                                <a href="mailto:sam.j.fortin@gmail.com" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                    sam.j.fortin@gmail.com
                                </a>
                            </p>
                            <p className="text-base/7 text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">X:</span>{' '}
                                <a href="https://x.com/sjfortin" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                    @sjfortin
                                </a>
                            </p>
                            <p className="text-base/7 text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">GitHub:</span>{' '}
                                <a href="https://github.com" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                    github.com/sjfortin
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
