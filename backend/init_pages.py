import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from deep_translator import GoogleTranslator
from datetime import datetime, timezone
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def auto_translate(text: str, source_lang: str = 'ru', target_lang: str = 'en') -> str:
    try:
        if not text or text.strip() == '':
            return text
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        return translator.translate(text)
    except Exception as e:
        print(f"Translation error: {e}")
        return text

pages_data = [
    {
        "id": str(uuid.uuid4()),
        "slug": "privacy",
        "title": "Политика конфиденциальности",
        "content": """<p class="text-lg">Последнее обновление: 1 января 2025</p>

<h2>1. Сбор информации</h2>
<p>Мы собираем информацию, которую вы предоставляете добровольно: имя, email, название компании, телефон. Также мы собираем техническую информацию: IP-адрес, тип браузера, страницы посещения.</p>

<h2>2. Использование информации</h2>
<ul>
<li>Ответ на ваши запросы</li>
<li>Улучшение наших услуг</li>
<li>Аналитика и исследования</li>
<li>Информирование о новых услугах (с вашего согласия)</li>
</ul>

<h2>3. Защита данных</h2>
<p>Мы используем современные методы защиты: SSL-шифрование, защищенные серверы, ограниченный доступ к данным.</p>

<h2>4. Ваши права</h2>
<ul>
<li>Право на доступ к вашим данным</li>
<li>Право на исправление данных</li>
<li>Право на удаление данных</li>
<li>Право на отзыв согласия</li>
</ul>

<h2>5. Контакты</h2>
<p>По вопросам конфиденциальности обращайтесь: mail@aichin.org</p>""",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "terms",
        "title": "Условия использования",
        "content": """<p class="text-lg">Последнее обновление: 1 января 2025</p>

<h2>1. Общие положения</h2>
<p>Используя наш сайт, вы соглашаетесь с настоящими условиями. Если вы не согласны, пожалуйста, прекратите использование сайта.</p>

<h2>2. Интеллектуальная собственность</h2>
<p>Все материалы на сайте являются собственностью AICHIN GROUP. Запрещено копирование без письменного разрешения.</p>

<h2>3. Услуги</h2>
<ul>
<li>Услуги предоставляются на основе отдельных договоров</li>
<li>Цены и условия обсуждаются индивидуально</li>
<li>Мы оставляем за собой право отказать в обслуживании</li>
</ul>

<h2>4. Ограничение ответственности</h2>
<p>AICHIN GROUP не несет ответственности за косвенные убытки, возникшие в результате использования сайта или наших услуг.</p>

<h2>5. Изменения условий</h2>
<p>Мы оставляем за собой право изменять условия в любое время. Изменения вступают в силу с момента публикации на сайте.</p>

<h2>6. Контакты</h2>
<p>По вопросам обращайтесь: mail@aichin.org</p>""",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "nda",
        "title": "Соглашение о конфиденциальности (NDA)",
        "content": """<p>AICHIN GROUP серьезно относится к защите конфиденциальной информации наших клиентов и партнеров.</p>

<h2>Основные положения:</h2>
<ul>
<li>Вся предоставленная информация считается конфиденциальной</li>
<li>Использование информации только для целей сотрудничества</li>
<li>Запрет на разглашение третьим лицам</li>
<li>Обязательство сохраняется в течение 5 лет после окончания сотрудничества</li>
</ul>

<h2>Как мы работаем с NDA:</h2>
<p>Перед началом сотрудничества мы подписываем двустороннее соглашение о неразглашении. Это защищает интересы обеих сторон и создает основу для доверительных отношений.</p>""",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "download",
        "title": "Материалы для скачивания",
        "content": """<p>Полезные материалы и гиды по работе с китайским рынком</p>

<h2>Доступные материалы:</h2>
<ul>
<li><strong>Презентация компании</strong> - Обзор наших услуг, кейсов и преимуществ (PDF, 12 MB)</li>
<li><strong>Чек-лист по поставкам</strong> - Шаги для успешной организации поставок из Китая (PDF, 2 MB)</li>
<li><strong>Гид по контролю качества</strong> - Ключевые аспекты QC и инспекций на производстве (PDF, 5 MB)</li>
<li><strong>Шаблон брифа на проект</strong> - Структурированный шаблон для описания вашего проекта (XLSX, 1 MB)</li>
</ul>

<p>Для получения материалов свяжитесь с нами: mail@aichin.org</p>""",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

async def init_pages():
    print("Initializing static pages...")
    
    for page in pages_data:
        # Add English translations
        page['title_en'] = auto_translate(page['title'])
        page['content_en'] = auto_translate(page['content'])
        
        # Check if page already exists
        existing = await db.pages.find_one({"slug": page['slug']})
        if existing:
            print(f"Page '{page['slug']}' already exists, updating...")
            await db.pages.update_one(
                {"slug": page['slug']},
                {"$set": page}
            )
        else:
            print(f"Creating page '{page['slug']}'...")
            await db.pages.insert_one(page)
    
    print("Done! Pages initialized.")

if __name__ == "__main__":
    asyncio.run(init_pages())
