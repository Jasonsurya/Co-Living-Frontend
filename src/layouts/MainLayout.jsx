import Sidebar from "./Sidebar";
import Header from "./Header";

export default function mainMainLayout({ children, title, description }) {
    return (
    <div className="flex max-h-screen bg-slate-100">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
            <Header title={title} description={description}/>

        <section className="p-6 flex-1 overflow-y-auto">
                    {children}
        </section>
        </main>
    </div>
    );
};