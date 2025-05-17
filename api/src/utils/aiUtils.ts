import { GoogleGenerativeAI } from "@google/generative-ai";
import envConfig from "./envConfig";

let _envConfig = new envConfig();
export async function generateAIResponse(query: string) {
	const genAI = new GoogleGenerativeAI(_envConfig.GOOGLE_API_KEY || "");
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });

	const prompt = query;

	let retries = 3; // Number of retry attempts
	let delay = 1000; // Initial delay in milliseconds

	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			const result = await model.generateContent(prompt);
			console.log(result.response.text());
			return result.response.text();
		} catch (error) {
			if (attempt < retries - 1) {
				console.error(`Attempt ${attempt + 1} failed. Retrying after ${delay}ms...`);
				await new Promise((resolve) => setTimeout(resolve, delay));
				delay *= 2; // Exponential backoff
			} else {
				console.error("All retries failed:", error);
				throw error; // Rethrow error after all retries
			}
		}
	}
}
