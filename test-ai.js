const testAI = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: "Software Engineer at Google, 2020-2023. Worked on search ranking.",
                type: "experience"
            })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
};

testAI();
