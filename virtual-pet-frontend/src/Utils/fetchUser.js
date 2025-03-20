export const fetchUser = async (setUser) => {
    try {
        const response = await fetch(`http://localhost:8080/auth/${localStorage.getItem("userId")}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (response.ok) {
            const updatedUser = await response.json();
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
            console.error("Failed to fetch user data:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};