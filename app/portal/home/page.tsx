import Image from "next/image";
import {
    Monitor,
    Server,
    Activity,
    BarChart,
    GitPullRequest,
    Layout,
    Smartphone,
    Shield,
    Cloud
} from "lucide-react";



const categories = [
    {
        title: "Frontend Developer",
        description: "Build stunning, interactive user interfaces.",
        icon: Monitor,
    },
    {
        title: "Backend Developer",
        description: "Develop robust and scalable server applications.",
        icon: Server,
    },
    {
        title: "Full Stack Developer",
        description: "Master both the front and back end of applications.",
        icon: Activity,
    },
    {
        title: "Data Scientist",
        description: "Transform data into meaningful insights.",
        icon: BarChart,
    },
    {
        title: "DevOps Engineer",
        description: "Automate and streamline your development processes.",
        icon: GitPullRequest,
    },
    {
        title: "UX/UI Designer",
        description: "Design intuitive and engaging user experiences.",
        icon: Layout,
    },
    {
        title: "Mobile Developer",
        description: "Create powerful mobile applications for iOS and Android.",
        icon: Smartphone,
    },
    {
        title: "Cyber Security Engineer",
        description: "Protect systems and networks from cyber threats.",
        icon: Shield,
    },
    {
        title: "AI/ML Engineer",
        description: "Develop intelligent algorithms and machine learning models.",
        icon: Shield,
    },
    {
        title: "Cloud Architect",
        description: "Design scalable, secure cloud infrastructures.",
        icon: Cloud,
    },
];

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}

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
                                href="/portal/jobs"
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

                {/* Job Categories Section */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <h3 className="text-3xl font-bold text-white text-center">Explore IT Job Categories</h3>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <div
                                        key={cat.title}
                                        className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/10 shadow-md hover:shadow-xl transition duration-300"
                                    >
                                        <Icon className="w-10 h-10 text-green-400" />
                                        <h4 className="mt-4 text-xl font-bold text-white">{cat.title}</h4>
                                        <p className="mt-2 text-sm text-white/80">{cat.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-4 text-white text-center">
                © {new Date().getFullYear()} Job-It. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;
