sekta-site
Sekta.media — Адаптивный лендинг с формой отправки заявок в Telegram через backend (Node.js + Express).
Данные формы идут только на backend, токен Telegram бота и chat_id скрыты.

Структура проекта
sekta-site/

backend/

package.json

server.js

public/

index.html

favicon.ico

(другие статические файлы)

README.md

1. Быстрый старт (локально)
Клонируй репозиторий и установи зависимости:

git clone https://github.com/yourusername/sekta-site.git
cd sekta-site/backend
npm install

Открой backend/server.js и впиши свои значения:
const TELEGRAM_BOT_TOKEN = 'your_telegram_bot_token';
const TELEGRAM_CHAT_ID = 'your_telegram_chat_id';

Запусти сервер:
node server.js

Открой сайт в браузере: http://localhost:3001

2. Развёртывание на Ubuntu VPS (production, Cloudflare SSL)
2.1. Установка nginx
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

Проверь, что nginx работает:
sudo systemctl status nginx

2.2. Установка Node.js, git
sudo apt install -y nodejs npm git

2.3. Клонирование репозитория и установка зависимостей
git clone https://github.com/yourusername/sekta-site.git
cd sekta-site/backend
npm install

2.4. Запуск backend через pm2
npm install -g pm2
pm2 start server.js --name sekta-backend
pm2 startup
pm2 save

2.5. Настройка nginx для sekta.media (Cloudflare)
Создай файл:
sudo nano /etc/nginx/sites-available/sekta.media

Вставь конфиг:

server {
listen 80;
server_name sekta.media www.sekta.media;
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
}

Подключи сайт и перезагрузи nginx:
sudo ln -s /etc/nginx/sites-available/sekta.media /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

2.6. Настройка Cloudflare
В Cloudflare DNS добавь записи:

A sekta.media → 80.78.28.236

A www.sekta.media → 80.78.28.236

Включи SSL (Full или Flexible) в разделе SSL/TLS.

Включи “Always Use HTTPS”.

Теперь все HTTPS-запросы клиентов идут через Cloudflare на твой nginx (HTTP:80) и дальше на Node.js backend (3001 порт).

2.7. Проверка
Открой сайт: https://sekta.media

Проверь отправку формы — заявки должны приходить в Telegram.

3. Обновление проекта
При обновлении кода просто выполни:

cd sekta-site
git pull
cd backend
npm install
pm2 restart sekta-backend
sudo systemctl reload nginx

4. Безопасность
Все чувствительные данные (токен Telegram, chat_id) хранятся только на сервере.

Внешний трафик всегда идет через Cloudflare (SSL).

