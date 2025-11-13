import Header from "@/components/Header";
import Footer from "@/components/Footer";

const socialMedia = [
    {
        name: "Email",
        url: "mailto:sam.j.fortin@gmail.com",
        icon: "envelope"
    },
    {
        name: "GitHub",
        url: "https://github.com",
        icon: "github"
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com",
        icon: "linkedin"
    }
]

export default function Contact() {
    return (
        <>
            <Header />
            <div>
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                            Get in Touch
                        </h1>
                        <div className="mt-6 space-y-4">
                            {socialMedia.map((media) => (
                                <p key={media.name} className="text-base/7 text-gray-600 dark:text-gray-300">
                                    <span className="font-semibold">{media.name}:</span>{' '}
                                    <a href={media.url} className="text-gray-600 hover:text-gray-500 dark:text-gray-400">
                                        {media.icon}
                                    </a>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
