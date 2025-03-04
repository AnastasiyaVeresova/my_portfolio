import os

def rename_files_in_directory(directory_path):
    # Получаем список всех элементов в указанной папке
    items = os.listdir(directory_path)

    # Проходим по каждому элементу
    for item in items:
        item_path = os.path.join(directory_path, item)

        # Если элемент является папкой, рекурсивно вызываем функцию для этой папки
        if os.path.isdir(item_path):
            rename_files_in_directory(item_path)
        else:
            # Если элемент является файлом, переименовываем его
            files = [f for f in items if os.path.isfile(os.path.join(directory_path, f))]
            files.sort()

            # Переименовываем файлы
            for index, filename in enumerate(files, start=1):
                # Разделяем имя файла и расширение
                name, ext = os.path.splitext(filename)
                # Формируем новое имя файла
                new_name = f"{index}{ext}"
                # Полный путь к старому и новому файлу
                old_file = os.path.join(directory_path, filename)
                new_file = os.path.join(directory_path, new_name)
                # Переименовываем файл
                os.rename(old_file, new_file)
                print(f"Renamed: {old_file} -> {new_file}")

# Путь к папке, в которой нужно переименовать файлы
base_directory_path = './img/outdoor'
rename_files_in_directory(base_directory_path)

# python rename_files.py
