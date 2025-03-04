document.addEventListener("DOMContentLoaded", function() {
    // Запрашиваем у пользователя количество изображений
    const numberOfImages = parseInt(prompt("Сколько изображений вы хотите добавить?"), 10);

    if (isNaN(numberOfImages) || numberOfImages <= 0) {
        alert("Пожалуйста, введите корректное число больше 0.");
        return;
    }

    const gallery = document.getElementById('image-gallery');

    // Добавляем изображения в контейнер
    for (let i = 1; i <= numberOfImages; i++) {
        const imgElement = document.createElement('img');
        imgElement.src = `img/${i}.jpg`; // Предполагается, что изображения имеют названия 1.jpg, 2.jpg и т.д.
        imgElement.alt = `Image ${i}`;
        gallery.appendChild(imgElement);
    }
});
