def generate_html_for_images(number_of_images):
    html_code = []
    name_of_folder = str(input("Как называется папка? "))
    for i in range(1, number_of_images + 1):
        html_code.append(f'<img src="img/{name_of_folder}/{i}.jpg" alt="{name_of_folder} {i}">')
    return html_code

def main():
    try:
        number_of_images = int(input("Сколько изображений вы хотите добавить? "))
        if number_of_images <= 0:
            raise ValueError("Число должно быть больше 0.")        

        html_code = generate_html_for_images(number_of_images)

        print("Сгенерированный HTML-код:")
        for line in html_code:
            print(line)

    except ValueError as e:
        print(f"Ошибка: {e}")

if __name__ == "__main__":
    main()
