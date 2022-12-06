# generate-ical

This is a lightweight and typed utility to generate iCal files. With minimal dependencies and minimal code and complexity, this can be used almost everywhere.

It doesn't depend on the implementation, e.g Express, Koa, file system, etc. This will just generate the file content as a string for you to do whatever you want with.

## Install

`npm install generate-ical`

## Usage

```typescript
const fileContent = generateIcal({
	title: "My First Event",
	description: {
		plain: "My event description",
		html: "<p>My event description <b>formatted with HTML</b></p>",
	},
	isAllDay: false,
	startDate: new Date("2023-01-01T18:00:00.000Z"),
	endDate: new Date("2023-01-01T22:00:00.000Z"),
	location: { title: "My place" },
	url: "https://optional-video-call.com",
	organizer: { name: "Lukas Wiklund" },
})
```

## Examples

### File System

```typescript
fs.writeFileSync("./Event.ics", fileContent)
```

### Koa

```typescript
context.response.set("Content-Type", "text/calendar")
context.response.set("Content-Disposition", `attachment; filename="Event.ics"`)
context.body = fileContent
```
