import { apiPrefix } from "./apiPrefix";

export const getTranslation = async (message: string, language: string) => {
	const body = JSON.stringify({
		language,
		message
	});
	const response = await fetch(apiPrefix + "translate.php", {
		method: "POST", body, headers: {
			"Content-Type": "application/json"
		}
	});
	const translation = await response.json();
	return translation;
}
