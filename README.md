# Тестовое задание: RESTful API для управления книгами с аутентификацией

## Цель

Создать приложение на NestJS, которое предоставляет RESTful API для управления книгами и имеет систему аутентификации пользователей.

## Установка и запуск

1. Создать файл .env и внести в него следующие данные (пример)
```yaml
PORT=8000

DATABASE_URL="postgresql://root:password@localhost:5432/books_db?schema=public"

POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=books_db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=root

JWT_SECRET=secret
```
2. Запустить докер контейнеры
```bash
docker-compose up --build
```
3. Докуменация swagger доступна по адресу [http://localhost:8000/](http://localhost:8000/)


## Основные требования

### 1. Модель данных

- **Пользователь**:
    - ID (уникальный идентификатор)
    - Имя пользователя
    - Электронная почта (уникальная)
    - Пароль (зашифрованный)

- **Книга**:
    - ID (уникальный идентификатор)
    - Название
    - Автор
    - Год издания
    - Краткое описание
    - ID пользователя (владельца книги)

### 2. CRUD операции

- `POST /users/register` – регистрация нового пользователя.
- `POST /users/login` – аутентификация пользователя и возврат JWT токена.
- `POST /books` – добавление новой книги (только для аутентифицированных пользователей).
- `GET /books` – получение списка всех книг.
- `GET /books/:id` – получение детальной информации о книге по ID.
- `PUT /books/:id` – обновление информации о книге по ID (только владелец книги).
- `DELETE /books/:id` – удаление книги по ID (только владелец книги).

### 3. Валидация

- Проверять наличие и формат обязательных полей при регистрации и добавлении книги.

### 4. Обработка ошибок

- Возвращать соответствующие сообщения об ошибках и HTTP статусы.

### 5. Хранение данных

- Для хранения данных использовать Postgres.

### 6. Аутентификация и авторизация

- Использовать JWT для аутентификации.
- Проверять права доступа пользователя к операциям с книгами.
- Список книг должен работать без авторизации

## Дополнительные задачи

1. **Пагинация**: Добавить возможность пагинации для `GET /books`.
2. **Фильтрация**: Добавить возможность фильтрации книг по автору или году издания.

