import pptxgen from "pptxgenjs";

// Creates a .pptx file from structured slide data and writes it to tempFilePath
const buildPptxFile = async (slideContent, tempFilePath) => {
	const prs = new pptxgen();

	// Title slide
	const titleSlide = prs.addSlide();
	titleSlide.addText(slideContent.title, {
		x: 1,
		y: 2,
		w: 8,
		h: 1.5,
		fontSize: 36,
		bold: true,
		align: "center",
	});

	// Content slides
	for (const slide of slideContent.slides) {
		const pptSlide = prs.addSlide();

		pptSlide.addText(slide.title, {
			x: 0.5,
			y: 0.3,
			w: 9,
			h: 1,
			fontSize: 24,
			bold: true,
		});

		// Format bullets as pptxgenjs text objects
		const bulletItems = slide.bullets.map((point) => ({
			text: point,
			options: { bullet: true, fontSize: 16, breakLine: true },
		}));

		pptSlide.addText(bulletItems, { x: 0.5, y: 1.5, w: 9, h: 4.5 });
	}

	// pptxgenjs writes the file to disk when given a file path (no extension needed — it adds .pptx)
	await prs.writeFile({ fileName: tempFilePath });
};

export default buildPptxFile;
