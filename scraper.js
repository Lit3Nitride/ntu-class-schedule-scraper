const puppeteer = require("puppeteer")

// Define venue-getting code for use in browser
function getVenues() {
	const days = {
			MON: 0,
			TUE: 1,
			WED: 2,
			THU: 3,
			FRI: 4,
			SAT: 5
		}
	// Venues go into this variable
	var venues = {}

	// Select all tables preceded by a header
	// (structure of the site is such that the first table contains the course details)
	for (let el of document.querySelectorAll("hr + table")) {
				// Extract the first two elements from the course details
		let [id, name] = [...el.children[0].children[0].children].map(t => t.innerText),
				// Grab the class details, excluding header row
				otherRows = [...el.nextElementSibling.children[0].children].splice(1)
		// Replace special characters at the end of the course name
		name = name.replace(/(?:\*|\#|\^)*$/, "")

		for (let row of otherRows) {
			let [day, time, venue, remark] = [...row.children].splice(3).map(t => t.innerText),
					only
			// Convert from format "XXXX - XXXX" to t0 & t1
			time = time.split("-").map(Number)

			// Ignore if no days or venues yet
			if (
				venue.replace(/\s/g, "") == "" ||
				["OVERSEAS", "ONLINE", "TBC", "TBA"].includes(venue.toUpperCase()) ||
				typeof days[day] == "undefined" ||
				remark == "Not conducted during Teaching Weeks"
			)
				break

			// Format exclusive weeks
			if (remark)
							 // Assume format "x,x,x,..."
				only = remark.replace("Teaching Wk", "").split(",").map(i => {

									// If format "Teaching Wk xx-xx", i will be "xx-xx".
									// Consider that case
									i = i.split("-").map(Number)

									// If not numbers, return empty array
									if (isNaN(i[0]) || (i[1] && isNaN(i[1])))
										return []

									// If "x,x,x,...", i will be just one number
									// If "xx-xx", there is a need to fill in the in-betweens
									if (i.length == 1)
										return i[0]
									else
										return [...Array(1+i[1]-i[0]).keys()].map(x => x+i[0])

								}).flat()

			// Initialise venue entry if it does not already exist
			// Creates a 6-day week
			if (Object.keys(venues).indexOf(venue) == -1)
				venues[venue] = [...Array(6).keys()].map( () => {return {}} )

			// Inserts the entry
			venues[venue][days[day]][time[0]] = {
				id: id,
				name: name,
				only: only,
				t1: time[1]
			}
		}
	}

	return venues
}

(async () => {

	// Initialise browser and page
  const browser = await puppeteer.launch()
	const page = (await browser.pages())[0]
	const popupPromise = new Promise(
		resolve => browser.once(
			"targetcreated",
			target => resolve(target.page())
		)
	)

	// Go to schedule page, search for all courses
  await page.goto("https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main")
	await page.evaluate(() => {
		// Bypass validation against passing no course
		search_text = () => true
    document.querySelector("input[name='r_subj_code']").value = ""
    document.querySelector("input[value='Search']").click()
	})

	// Wait for popup to load (red text only appears at the end)
	const popup = await popupPromise
	await popup.waitForSelector("font[color='RED']")

	// Get the venues, save as JSON
	const venues = await popup.evaluate(getVenues)
	console.log(JSON.stringify(venues, null, 2))

  await browser.close()

})()
