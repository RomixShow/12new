import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def init_database():
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Clear existing collections
    collections = ['services', 'cases', 'events', 'projects', 'partners', 'articles', 'team']
    for collection in collections:
        await db[collection].delete_many({})
    
    # Insert Services
    services = [
        {
            "id": "1",
            "slug": "trade-manufacturing",
            "name": "Trade & Manufacturing",
            "description": "Полный цикл поставок и производства в Китае",
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800",
            "features": ["Поиск поставщиков", "Контроль качества", "Производство под заказ"]
        },
        {
            "id": "2",
            "slug": "logistics-qc",
            "name": "Logistics & QC",
            "description": "Логистика и контроль качества",
            "image_url": "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=800",
            "features": ["Международная логистика", "Инспекции", "Складирование"]
        },
        {
            "id": "3",
            "slug": "corporate-travel-events",
            "name": "Corporate Travel & Events",
            "description": "Корпоративные поездки и мероприятия в Китае",
            "image_url": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800",
            "features": ["Бизнес-визиты", "Выставки", "B2B встречи"]
        },
        {
            "id": "4",
            "slug": "investments-partnerships",
            "name": "Investments & Partnerships",
            "description": "Инвестиционные проекты и партнерства",
            "image_url": "https://images.pexels.com/photos/3076002/pexels-photo-3076002.jpeg?auto=compress&w=800",
            "features": ["Поиск инвесторов", "Due diligence", "Сопровождение сделок"]
        }
    ]
    await db.services.insert_many(services)
    
    # Insert Cases
    cases = [
        {
            "id": "1",
            "slug": "electronics-manufacturing",
            "title": "Запуск производства электроники",
            "client": "TechCorp International",
            "category": "manufacturing",
            "description": "Организация производства электронных компонентов",
            "challenge": "Необходимость найти надежного производителя и запустить производство за 3 месяца",
            "solution": "Подобрали 5 фабрик, провели инспекции, организовали тестовое производство",
            "results": ["Запуск за 2.5 месяца", "Снижение себестоимости на 30%", "Качество 99.2%"],
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800",
            "created_at": "2024-12-01T00:00:00Z"
        },
        {
            "id": "2",
            "slug": "logistics-optimization",
            "title": "Оптимизация логистики для ритейла",
            "client": "Retail Chain LLC",
            "category": "logistics",
            "description": "Построение логистической цепочки для сети магазинов",
            "challenge": "Высокие затраты на доставку и длительные сроки",
            "solution": "Внедрили складскую логистику в Китае и оптимизировали маршруты",
            "results": ["Снижение затрат на 40%", "Сокращение сроков вдвое", "100% выполнение сроков"],
            "image_url": "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=800",
            "created_at": "2024-11-15T00:00:00Z"
        }
    ]
    await db.cases.insert_many(cases)
    
    # Insert Events
    events = [
        {
            "id": "1",
            "slug": "canton-fair-2025",
            "title": "Canton Fair Spring 2025",
            "date": "2025-04-15",
            "location": "Гуанчжоу, Китай",
            "type": "exhibition",
            "description": "Крупнейшая международная торговая выставка в Китае",
            "program": [
                {"day": 1, "title": "Регистрация и открытие", "time": "09:00"},
                {"day": 2, "title": "B2B встречи", "time": "10:00"},
                {"day": 3, "title": "Посещение фабрик", "time": "09:00"}
            ],
            "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"
        },
        {
            "id": "2",
            "slug": "china-business-mission",
            "title": "Бизнес-миссия в Китай",
            "date": "2025-06-10",
            "location": "Шанхай, Китай",
            "type": "business-tour",
            "description": "Недельная программа встреч с производителями и партнерами",
            "program": [
                {"day": 1, "title": "Прибытие и брифинг", "time": "18:00"},
                {"day": 2, "title": "Визиты на фабрики", "time": "09:00"},
                {"day": 3, "title": "Переговоры с партнерами", "time": "10:00"}
            ],
            "image_url": "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800"
        }
    ]
    await db.events.insert_many(events)
    
    # Insert Projects
    projects = [
        {
            "id": "1",
            "slug": "ai-robotics-startup",
            "title": "AI Robotics Startup",
            "description": "Стартап по разработке автономных роботов для логистики",
            "stage": "seed",
            "industry": "technology",
            "country": "China",
            "capital_required": "$2M",
            "timeline": "24 months",
            "status": "active",
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800"
        },
        {
            "id": "2",
            "slug": "renewable-energy-project",
            "title": "Renewable Energy Project",
            "description": "Проект по строительству солнечной электростанции",
            "stage": "growth",
            "industry": "energy",
            "country": "UAE",
            "capital_required": "$10M",
            "timeline": "36 months",
            "status": "active",
            "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800"
        }
    ]
    await db.projects.insert_many(projects)
    
    # Insert Partners
    partners = [
        {
            "id": "1",
            "slug": "tech-electronics-co",
            "name": "Tech Electronics Co.",
            "description": "Производитель электронных компонентов и устройств",
            "categories": ["electronics", "manufacturing"],
            "country": "China",
            "logo_url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400"
        },
        {
            "id": "2",
            "slug": "global-logistics-group",
            "name": "Global Logistics Group",
            "description": "Международная логистическая компания",
            "categories": ["logistics", "shipping"],
            "country": "China",
            "logo_url": "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=400"
        }
    ]
    await db.partners.insert_many(partners)
    
    # Insert Articles
    articles = [
        {
            "id": "1",
            "slug": "china-manufacturing-trends-2025",
            "title": "Тренды производства в Китае 2025",
            "excerpt": "Ключевые тенденции в китайском производстве: автоматизация, зеленые технологии и качество",
            "content": "Полный текст статьи о трендах производства...",
            "author": "Александр Петров",
            "published_at": "2025-01-01T00:00:00Z",
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800",
            "category": "manufacturing"
        },
        {
            "id": "2",
            "slug": "investment-opportunities-china",
            "title": "Инвестиционные возможности в Китае",
            "excerpt": "Обзор перспективных отраслей для инвестиций в китайскую экономику",
            "content": "Полный текст статьи об инвестициях...",
            "author": "Мария Смирнова",
            "published_at": "2024-12-15T00:00:00Z",
            "image_url": "https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=800",
            "category": "investments"
        }
    ]
    await db.articles.insert_many(articles)
    
    # Insert Team
    team = [
        {
            "id": "1",
            "name": "Алексей Чжан",
            "position": "CEO & Founder",
            "bio": "15 лет опыта в международной торговле",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
            "linkedin": "https://linkedin.com"
        },
        {
            "id": "2",
            "name": "Мария Ли",
            "position": "Head of Operations",
            "bio": "Эксперт по логистике и операционному менеджменту",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
            "linkedin": "https://linkedin.com"
        }
    ]
    await db.team.insert_many(team)
    
    print("✅ Database initialized successfully!")
    print(f"- Services: {len(services)}")
    print(f"- Cases: {len(cases)}")
    print(f"- Events: {len(events)}")
    print(f"- Projects: {len(projects)}")
    print(f"- Partners: {len(partners)}")
    print(f"- Articles: {len(articles)}")
    print(f"- Team: {len(team)}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_database())
