import uuid from "uuid-random"

type Event = {
	startDate: Date
	title: string
	description?: { plain: string; html?: string }
	location?: {
		title: string
		address?: string
		geo?: {
			lat: number
			lon: number
		}
	}
	organizer?: {
		name: string
		email?: string
		mailTo?: string
		sentBy?: string
	}
	url?: string
} & ({ isAllDay: true; endDate?: Date } | { isAllDay: false; endDate: Date })

export default function generateIcal(data: Event): string {
	const id = uuid()
	let result = ""

	function addRow(row: string): void {
		result += `${row}\r\n`
	}

	addRow("BEGIN:VEVENT")
	addRow(`UID:${id}`)
	addRow(`SEQUENCE:0`)
	addRow(`DTSTAMP:${formatDateTime(new Date())}`)
	addRow(`SUMMARY:${escape(data.title)}`)

	if (data.description !== undefined) {
		const { plain, html } = data.description
		addRow(`DESCRIPTION:${plain}`)

		if (html !== undefined) {
			addRow(`X-ALT-DESC;FMTTYPE=text/html:${escape(html)}`)
		}
	}

	if (data.isAllDay) {
		addRow(`DTSTART;VALUE=DATE:${formatDate(data.startDate)}`)
		if (data.endDate !== undefined) {
			addRow(`DTEND;VALUE=DATE:${formatDate(data.endDate)}`)
		}
	} else {
		addRow(`DTSTART:${formatDateTime(data.startDate)}`)
		addRow(`DTEND:${formatDateTime(data.endDate)}`)
	}

	if (data.location !== undefined) {
		addRow(`LOCATION:${escape(data.location.title)}`)
		if (data.location.address !== undefined) {
			addRow(escape(data.location.address))
		}

		if (data.location.geo !== undefined) {
			const { lat, lon } = data.location.geo
			addRow(`GEO:${escape(lat.toString())};${escape(lon.toString())}`)
		}
	}

	if (data.organizer !== undefined) {
		const { name, sentBy, email, mailTo } = data.organizer
		let string = `ORGANIZER;CN=${escapeInQuotes(name)}`
		if (sentBy !== undefined) {
			string += `;SENT-BY="mailto:${escapeInQuotes(sentBy)}"`
		}
		if (email !== undefined && mailTo !== undefined) {
			string += `;EMAIL=${escape(email)}`
		}
		if (email !== undefined) {
			string += `:mailto:${escape(mailTo ?? email)}`
		}
		addRow(string)
	}

	if (data.url !== undefined) {
		addRow(`URL;VALUE=URI:${escape(data.url)}`)
	}

	return result
}

export function escape(string: string): string {
	return string.replace(/[\\;,]/g, match => "\\" + match).replace(/(?:\r\n|\r|\n)/g, "\\n")
}

export function escapeInQuotes(string: string): string {
	return string.replace(/[\\;,"]/g, match => "\\" + match).replace(/(?:\r\n|\r|\n)/g, "\\n")
}

function formatDate(date: Date): string {
	const year = date.getUTCFullYear().toString()
	const month = `${date.getUTCMonth() + 1}`.padStart(2, "0")
	const day = `${date.getUTCDate()}`.padStart(2, "0")
	return `${year}${month}${day}`
}

function formatDateTime(date: Date): string {
	const hours = `${date.getUTCHours()}`.padStart(2, "0")
	const minutes = `${date.getUTCMinutes()}`.padStart(2, "0")
	const seconds = `${date.getUTCSeconds()}`.padStart(2, "0")
	return `${formatDate(date)}T${hours}${minutes}${seconds}Z`
}
