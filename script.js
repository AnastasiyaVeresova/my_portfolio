document.addEventListener("DOMContentLoaded", function() {
	window.scrollTo(0, 0);
	const categories = [
		"outdoor",
		"web",
		"modules",
		"presentations",
		"souvenirs",
		"video",
		"logos",
		"3d",
	];
	const randomImageDisplay = document.getElementById("random-image-display");
	const randomImageDescription = document.getElementById(
		"random-image-description"
	);
	const presentationSelector = document.getElementById("presentation-selector");
	const presentationViewer = document.getElementById("presentation-viewer");
	const themeToggle = document.getElementById("theme-toggle");
	const themeLabel = document.querySelector(".theme-label");
	const emailLink = document.getElementById("email-link");
	const gallerySection = document.getElementById("gallery");
	const scrollToTopButton = document.getElementById("scroll-to-top");
	const parallaxBackground = document.querySelector(".parallax-background");
	let allImages = [];
	let imagesWithDescriptions = {};
	let presentations = [];
	let colorThiefLoaded = false;

	// Попробуем загрузить vibrant
	try {
		import("vibrant")
			.then((Vibrant) => {
				vibrantLoaded = true;
				analyzeAndSortImages(Vibrant.default);
			})
			.catch((error) => {
				console.error("Vibrant module failed to load:", error);
				loadImages();
			});
	} catch (error) {
		console.error("Vibrant module is not available:", error);
		loadImages();
	}

	function loadImages() {
		fetch("images.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((imagesJson) => {
				categories.forEach((category) => {
					const gallery = document.getElementById(`image-gallery-${category}`);
					const images = imagesJson[category] || [];

					images.forEach((image) => {
						if (category !== "presentations" && category !== "video") {
							const imgContainer = document.createElement("div");
							imgContainer.className = "image-container";

							const imgElement = document.createElement("img");
							imgElement.src = `img/${category}/${image.file}`;
							imgElement.alt = image.file;
							imgContainer.appendChild(imgElement);

							gallery.appendChild(imgContainer);
						} else if (category === "video") {
							const videoContainer = document.createElement("div");
							videoContainer.className = "video-container";

							const videoElement = document.createElement("video");
							videoElement.src = `img/${category}/${image.file}`;
							videoElement.controls = true;
							videoElement.autoplay = true;
							videoContainer.appendChild(videoElement);

							gallery.appendChild(videoContainer);
						}

						// Добавляем изображение и описание в массив всех изображений, если это не PDF и категория входит в список разрешенных
						if (
							!image.file.endsWith(".pdf") &&
							["outdoor", "souvenirs", "3d"].includes(category)
						) {
							allImages.push({
								src: `img/${category}/${image.file}`,
								description: image.description,
								category: category,
							});
							imagesWithDescriptions[`img/${category}/${image.file}`] =
								image.description;
						}

						if (category === "presentations") {
							presentations.push(image);
						}
					});
				});

				// Заполняем выпадающий список презентациями
				presentations.forEach((presentation, index) => {
					const option = document.createElement("option");
					option.value = index;
					option.textContent = presentation.description;
					presentationSelector.appendChild(option);
				});

				// Устанавливаем первую презентацию по умолчанию
				if (presentations.length > 0) {
					presentationViewer.src = `img/presentations/${presentations[0].file}`;
				}

				// Обновляем случайное изображение после загрузки всех изображений
				updateRandomImage();

				// Обработчик события для выбора презентации
				presentationSelector.addEventListener("change", function () {
					const selectedIndex = presentationSelector.value;
					presentationViewer.src = `img/presentations/${presentations[selectedIndex].file}`;
				});

				// Обработчик события для переключения тем
				themeToggle.addEventListener("change", function () {
					document.body.classList.toggle("dark-mode", themeToggle.checked);
					document
						.querySelector("header")
						.classList.toggle("dark-mode", themeToggle.checked);
					document
						.querySelector("nav.menu")
						.classList.toggle("dark-mode", themeToggle.checked);
					document
						.querySelector("#contact")
						.classList.toggle("dark-mode", themeToggle.checked);
					document
						.querySelector("#random-image-description")
						.classList.toggle("dark-mode", themeToggle.checked);
					document
						.querySelector("footer")
						.classList.toggle("dark-mode", themeToggle.checked);
					gallerySection.classList.toggle("dark-mode", themeToggle.checked);
					themeLabel.textContent = themeToggle.checked
						? "Темная тема"
						: "Светлая тема";
					// emailLink.style.color = themeToggle.checked ? '#fff' : '#333';
				});
			})
			.catch((error) => console.error("Error loading images:", error));
	}

	function updateRandomImage() {
		if (allImages.length > 0) {
			const randomIndex = Math.floor(Math.random() * allImages.length);
			const randomImage = allImages[randomIndex];
			randomImageDisplay.src = randomImage.src;
			randomImageDisplay.classList.toggle(
				"web-image",
				randomImage.category === "web"
			);
			randomImageDescription.textContent = randomImage.description;
		}
	}

	// Обновляем случайное изображение каждые 5 секунд
	setInterval(updateRandomImage, 5000);

	function analyzeAndSortImages(ColorThief) {
		const imagesWithColors = [];

		allImages.forEach((image) => {
			const imgElement = new Image();
			imgElement.src = image.src;
			imgElement.onload = function () {
				const color = new ColorThief().getColor(imgElement);
				imagesWithColors.push({ ...image, color });

				// Если все изображения загружены и проанализированы, сортируем их
				if (imagesWithColors.length === allImages.length) {
					sortImagesByColor(imagesWithColors);
				}
			};
		});
	}

	function sortImagesByColor(imagesWithColors) {
		// Сортируем изображения по цвету (например, по яркости)
		imagesWithColors.sort((a, b) => {
			const brightnessA = (a.color[0] + a.color[1] + a.color[2]) / 3;
			const brightnessB = (b.color[0] + b.color[1] + b.color[2]) / 3;
			return brightnessA - brightnessB;
		});

		// Очищаем галерею и добавляем отсортированные изображения
		categories.forEach((category) => {
			const gallery = document.getElementById(`image-gallery-${category}`);
			gallery.innerHTML = "";
		});

		imagesWithColors.forEach((image) => {
			const imgContainer = document.createElement("div");
			imgContainer.className = "image-container";

			const imgElement = document.createElement("img");
			imgElement.src = image.src;
			imgElement.alt = image.description;
			imgContainer.appendChild(imgElement);

			// Добавляем изображение в соответствующую галерею
			const category = image.src.split("/")[1];
			const gallery = document.getElementById(`image-gallery-${category}`);
			gallery.appendChild(imgContainer);
		});
	}

	function generateRandomShape() {
		const shapeTypes = ["circle", "square", "triangle"];
		const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
		const shape = document.createElement("div");
		shape.className = `shape ${shapeType}`;

		const size = Math.random() * 100 + 50;
		const positionX = Math.random() * window.innerWidth;
		const positionY = Math.random() * window.innerHeight;
		const delay = Math.random() * 5;

		shape.style.width = `${size}px`;
		shape.style.height = `${size}px`;
		shape.style.left = `${positionX}px`;
		shape.style.top = `${positionY}px`;
		shape.style.animationDelay = `${delay}s`;

		if (shapeType === "circle") {
			shape.style.borderRadius = "50%";
		} else if (shapeType === "triangle") {
			shape.style.width = "0";
			shape.style.height = "0";
			shape.style.borderLeft = `${size / 2}px solid transparent`;
			shape.style.borderRight = `${size / 2}px solid transparent`;
			shape.style.borderBottom = `${size}px solid #ccc`;
		}

		parallaxBackground.appendChild(shape);
	}

	function generateShapes(count) {
		for (let i = 0; i < count; i++) {
			generateRandomShape();
		}
	}

	generateShapes(40);
});

function scrollToId(id) {
	document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function () {
	const scrollToTopButton = document.getElementById("scroll-to-top");

	scrollToTopButton.addEventListener("click", function () {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});

	window.addEventListener("scroll", function () {
		if (window.scrollY > 100) {
			scrollToTopButton.style.display = "flex";
		} else {
			scrollToTopButton.style.display = "none";
		}
	});
});