import { GoAlert } from './schema';

export async function fetchGOAlerts() {
	const response = await fetch('https://api.gotransit.com/v2/serviceupdate/en/all');
	const data: GoAlert = await response.json();
	return data;
}

function decodeHTMLEntities(text: string) {
	const entities: Record<string, string> = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
		'&#8217;': "'",
		'&nbsp;': ' ',
	};
	return text.replace(/&[a-zA-Z0-9#]+;/g, (match) => entities[match] || match);
}

export function extractContentFromHTML(html: string) {
	return decodeHTMLEntities(
		html
			.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
			.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
			.replace(/<\/?[^>]+(>|$)/g, '')
			.replace(/ style="[^"]*"/gi, '')
			.replace(/ class="[^"]*"/gi, '')
			.trim()
	);
}
