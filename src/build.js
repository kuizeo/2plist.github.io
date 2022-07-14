const fs = require("fs").promises;
const db = require("./database");

async function createNewPage(data, el) {
	const demonSlug = el.name.toLowerCase().replaceAll(" ", "-");
	let file = await fs.readFile("./pages/level.html", "utf-8");

	file = file
		.replaceAll("!ID!", el.id)
		.replaceAll("!NAME!", el.name)
		.replaceAll("!CREATOR!", el.creator)
		.replaceAll("!VERIFIER!", el.verifier)
		.replaceAll("!VIDEO!", el.video);

	const str = `<\${Demon}
		name="${el.name}"
		creator="${el.creator}"
		verifier="${el.verifier}"
		video="${el.video}"
	/>`;

	data = data.replace("!DEMONS!", "!DEMONS!" + str);

	await fs.writeFile(`../docs/demon/${demonSlug}.html`, file);
	await fs.writeFile(`../docs/index.html`, data);

	return data;
}

(async function() {
	await fs.mkdir("../docs");
	await fs.mkdir("../docs/demon");

	await fs.copyFile("./pages/index.html", "../docs/index.html");
	await fs.copyFile("./pages/style.css", "../docs/style.css");

	let data = await fs.readFile("pages/index.html", "utf-8");
	db.forEach(async (el) => data = await createNewPage(data, el));

	data = data.replace("!DEMONS!", "");
	fs.writeFile("../docs/index.html", data);
	
	console.log("Successfully compiled.");
})();