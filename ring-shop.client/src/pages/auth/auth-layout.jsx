export default function AuthLayout({ children }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <div style={{ background: "#FBF8F3", padding: "40px", borderRadius: "10px", maxWidth: "400px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)" }}>
                {children}
            </div>
        </div>
    );
}