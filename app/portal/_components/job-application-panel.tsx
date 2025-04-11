import { useState, FormEvent } from 'react'

const JobsApplicationPanel = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        resume: null as File | null,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, resume: e.target.files[0] }))
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        // Here you can add your API call or submission logic
        console.log('Форма відгуку на вакансію:', formData)
    }

    return (
        <div className="space-y-6 p-6 bg-white text-gray-900 rounded-2xl shadow-lg border border-slate-200">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Відгукнутись</h2>
                <p className="text-sm text-slate-600">
                    Заповніть форму нижче, щоб подати свій відгук на вакансію.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Ім&apos;я та Прізвище
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Ваші ім'я та прізвище"
                        className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Електронна пошта
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Телефон
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+38 (XXX) XXX-XX-XX"
                        className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Cover Letter */}
                <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                        Супровідний лист
                    </label>
                    <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Напишіть короткий супровідний лист..."
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Resume */}
                <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                        Додати резюме
                    </label>
                    <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleFileChange}
                        className="mt-1 block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        accept=".pdf,.doc,.docx"
                    />
                    {formData.resume && (
                        <p className="mt-2 text-xs text-green-600">
                            Обрано файл: {formData.resume.name}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-green-600 py-3 px-4 text-lg font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    >
                        Відправити відгук
                    </button>
                </div>
            </form>
        </div>
    )
}

export default JobsApplicationPanel
