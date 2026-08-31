export default function AuthLayout({ children }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <div style={{
                display: "flex", justifyContent: "center", alignItems: "center", background: "#faf7f1", flexDirection: "column",
                padding: "40px", borderRadius: "10px", maxWidth: "600px", boxShadow: "0 0 24px rgba(50, 35, 15, 0.20)"
            }}>
                <img src="images/logo.png" style={{width: "30%"}} />
                {children}
            </div>
        </div>
    );
}