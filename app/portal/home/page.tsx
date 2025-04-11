import Image from "next/image";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-extrabold text-white tracking-wide">Job-It</h1>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Text Content */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                            Your Dream Job Awaits
                        </h2>
                        <p className="mt-4 max-w-xl text-lg text-white/80">
                            Explore thousands of job opportunities, connect with top employers, and find the perfect match for your career.
                        </p>
                        <div className="mt-8">
                            <a
                                href="/jobs"
                                className="px-8 py-4 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold rounded-lg shadow-lg"
                            >
                                Browse Jobs
                            </a>
                        </div>
                    </div>
                    {/* Image Content */}
                    <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                        <Image
                            src="/cat_with_pc.png"
                            alt="Cat with PC"
                            width={400}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-white text-center">
                © {new Date().getFullYear()} Job-It. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;
