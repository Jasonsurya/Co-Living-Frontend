export default function Header({ title, description }) {
    return (
        <header className="bg-white p-6 border-b"> 
            <h1 className="text-2xl font-bold">
                {title}
                </h1>
            <p className="text-gray-500">
                {description}
                </p>
        </header>
    );
}