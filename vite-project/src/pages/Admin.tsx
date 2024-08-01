import AdminNavbar from "../components/AdminNavbar"

const Admin = () => {
    return (
        <div>
            <div className="flex ">
                <section className="w-[20%] bg-red-400 h-screen">
                    <AdminNavbar />
                </section>
                <section className="w-[80%] bg-green-500 h-screen"></section>
            </div>

        </div>
    )
}

export default Admin
