import json
import os
import asyncio
from datetime import datetime, timezone
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

from dotenv import load_dotenv
load_dotenv()

ROOT = Path(__file__).parent
FRONTEND_LOCALES = ROOT.parent / "frontend" / "src" / "locales"


def load_locale(name):
    path = FRONTEND_LOCALES / f"{name}.json"
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def get_value(data, path, default=""):
    ref = data
    for part in path.split("."):
        if isinstance(ref, dict) and part in ref:
            ref = ref[part]
        else:
            return default
    return ref


def build_pages(ru, en):
    services = [
        {
            "slug": "trade-manufacturing",
            "name_ru": get_value(ru, "services.trade.name"),
            "name_en": get_value(en, "services.trade.name"),
            "desc_ru": get_value(ru, "services.trade.desc"),
            "desc_en": get_value(en, "services.trade.desc"),
            "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200",
        },
        {
            "slug": "logistics-qc",
            "name_ru": get_value(ru, "services.logistics.name"),
            "name_en": get_value(en, "services.logistics.name"),
            "desc_ru": get_value(ru, "services.logistics.desc"),
            "desc_en": get_value(en, "services.logistics.desc"),
            "image": "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=1200",
        },
        {
            "slug": "corporate-travel-events",
            "name_ru": get_value(ru, "services.travel.name"),
            "name_en": get_value(en, "services.travel.name"),
            "desc_ru": get_value(ru, "services.travel.desc"),
            "desc_en": get_value(en, "services.travel.desc"),
            "image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200",
        },
        {
            "slug": "investments-partnerships",
            "name_ru": get_value(ru, "services.investments.name"),
            "name_en": get_value(en, "services.investments.name"),
            "desc_ru": get_value(ru, "services.investments.desc"),
            "desc_en": get_value(en, "services.investments.desc"),
            "image": "https://images.pexels.com/photos/3076002/pexels-photo-3076002.jpeg?auto=compress&w=1200",
        },
    ]

    home_cards = [
        {
            "title": s["name_ru"],
            "title_en": s["name_en"],
            "description": s["desc_ru"],
            "description_en": s["desc_en"],
            "image_url": s["image"],
            "link": f"/services/{s['slug']}",
        }
        for s in services
    ]

    home_stats = [
        {"value": "12", "suffix": "+", "label": get_value(ru, "stats.years"), "label_en": get_value(en, "stats.years")},
        {"value": "25", "suffix": "+", "label": get_value(ru, "stats.countries"), "label_en": get_value(en, "stats.countries")},
        {"value": "500", "suffix": "+", "label": get_value(ru, "stats.projects"), "label_en": get_value(en, "stats.projects")},
        {"value": "45", "suffix": " days", "label": get_value(ru, "stats.launch"), "label_en": get_value(en, "stats.launch")},
    ]

    process_steps_ru = [get_value(ru, f"process.step{i}") for i in range(1, 7)]
    process_steps_en = [get_value(en, f"process.step{i}") for i in range(1, 7)]


    trust_logos = [
        {"image_url": "/partners/1.jpg", "link": "https://alfabank.ru"},
        {"image_url": "/partners/2.jpg", "link": "https://vtb.ru"},
        {"image_url": "/partners/3.jpg", "link": "https://www.ozon.ru"},
        {"image_url": "/partners/4.jpg", "link": "https://www.wildberries.ru"},
        {"image_url": "/partners/1.jpg", "link": "https://yandex.ru"},
        {"image_url": "/partners/1.jpg", "link": "https://www.huawei.com"},
    ]

    pages = [
        {
            "slug": "home",
            "title": get_value(ru, "nav.home"),
            "title_en": get_value(en, "nav.home"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "hero.title"),
                    "title_en": get_value(en, "hero.title"),
                    "subtitle": get_value(ru, "hero.subtitle"),
                    "subtitle_en": get_value(en, "hero.subtitle"),
                    "cta_label": get_value(ru, "hero.cta_primary"),
                    "cta_label_en": get_value(en, "hero.cta_primary"),
                    "cta_href": "/contact",
                    "use_liquid": True,
                    "liquid_colors": ["#e70d0d", "#850000", "#ea6d57"],
                    "full_bleed": True,
                },
                {
                    "type": "marquee",
                    "items": trust_logos,
                },
                {
                    "type": "cards",
                    "title": get_value(ru, "services.title"),
                    "title_en": get_value(en, "services.title"),
                    "items": home_cards,
                },
                {
                    "type": "stats",
                    "items": home_stats,
                },
                {
                    "type": "list",
                    "title": get_value(ru, "process.title"),
                    "title_en": get_value(en, "process.title"),
                    "items": process_steps_ru,
                    "items_en": process_steps_en,
                },
            ],
            "hide_title": True,
            "full_width": True,
        },
        {
            "slug": "about",
            "title": get_value(ru, "about.title"),
            "title_en": get_value(en, "about.title"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "about.title"),
                    "title_en": get_value(en, "about.title"),
                    "subtitle": get_value(ru, "about.headline"),
                    "subtitle_en": get_value(en, "about.headline"),
                },
                {
                    "type": "text",
                    "heading": get_value(ru, "about.headline"),
                    "heading_en": get_value(en, "about.headline"),
                    "body": f"{get_value(ru, 'about.description1')}\\n\\n{get_value(ru, 'about.description2')}",
                    "body_en": f"{get_value(en, 'about.description1')}\\n\\n{get_value(en, 'about.description2')}",
                },
                {
                    "type": "image",
                    "url": "https://images.unsplash.com/photo-1758691736821-f1a600c0c3f1?q=80&w=800",
                },
                {
                    "type": "cards",
                    "title": get_value(ru, "about.values_title"),
                    "title_en": get_value(en, "about.values_title"),
                    "items": [
                        {
                            "title": get_value(ru, "about.values.innovation.title"),
                            "title_en": get_value(en, "about.values.innovation.title"),
                            "description": get_value(ru, "about.values.innovation.desc"),
                            "description_en": get_value(en, "about.values.innovation.desc"),
                        },
                        {
                            "title": get_value(ru, "about.values.trust.title"),
                            "title_en": get_value(en, "about.values.trust.title"),
                            "description": get_value(ru, "about.values.trust.desc"),
                            "description_en": get_value(en, "about.values.trust.desc"),
                        },
                        {
                            "title": get_value(ru, "about.values.scale.title"),
                            "title_en": get_value(en, "about.values.scale.title"),
                            "description": get_value(ru, "about.values.scale.desc"),
                            "description_en": get_value(en, "about.values.scale.desc"),
                        },
                        {
                            "title": get_value(ru, "about.values.precision.title"),
                            "title_en": get_value(en, "about.values.precision.title"),
                            "description": get_value(ru, "about.values.precision.desc"),
                            "description_en": get_value(en, "about.values.precision.desc"),
                        },
                    ],
                },
                {
                    "type": "cards",
                    "title": get_value(ru, "about.geography_title"),
                    "title_en": get_value(en, "about.geography_title"),
                    "items": [
                        {
                            "title": get_value(ru, "about.locations.china.name"),
                            "title_en": get_value(en, "about.locations.china.name"),
                            "description": get_value(ru, "about.locations.china.cities"),
                            "description_en": get_value(en, "about.locations.china.cities"),
                        },
                        {
                            "title": get_value(ru, "about.locations.russia.name"),
                            "title_en": get_value(en, "about.locations.russia.name"),
                            "description": get_value(ru, "about.locations.russia.cities"),
                            "description_en": get_value(en, "about.locations.russia.cities"),
                        },
                        {
                            "title": get_value(ru, "about.locations.uae.name"),
                            "title_en": get_value(en, "about.locations.uae.name"),
                            "description": get_value(ru, "about.locations.uae.cities"),
                            "description_en": get_value(en, "about.locations.uae.cities"),
                        },
                    ],
                },
                {
                    "type": "collection",
                    "title": get_value(ru, "about.team_title"),
                    "title_en": get_value(en, "about.team_title"),
                    "collection": "team",
                    "limit": 0,
                },
            ],
        },
        {
            "slug": "services",
            "title": get_value(ru, "services.title"),
            "title_en": get_value(en, "services.title"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "services.title"),
                    "title_en": get_value(en, "services.title"),
                    "subtitle": get_value(ru, "services.subtitle"),
                    "subtitle_en": get_value(en, "services.subtitle"),
                },
                {
                    "type": "cards",
                    "title": get_value(ru, "services.title"),
                    "title_en": get_value(en, "services.title"),
                    "items": home_cards,
                },
            ],
        },
        {
            "slug": "contact",
            "title": get_value(ru, "nav.contact"),
            "title_en": get_value(en, "nav.contact"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "nav.contact"),
                    "title_en": get_value(en, "nav.contact"),
                    "subtitle": get_value(ru, "contact.form_title"),
                    "subtitle_en": get_value(en, "contact.form_title"),
                },
                {
                    "type": "list",
                    "title": get_value(ru, "contact.offices_title"),
                    "title_en": get_value(en, "contact.offices_title"),
                    "items": [
                        get_value(ru, "contact.offices.shanghai"),
                        get_value(ru, "contact.offices.moscow"),
                        get_value(ru, "contact.offices.dubai"),
                    ],
                    "items_en": [
                        get_value(en, "contact.offices.shanghai"),
                        get_value(en, "contact.offices.moscow"),
                        get_value(en, "contact.offices.dubai"),
                    ],
                },
                {
                    "type": "text",
                    "heading": get_value(ru, "contact.working_hours_title"),
                    "heading_en": get_value(en, "contact.working_hours_title"),
                    "body": f"{get_value(ru, 'contact.working_hours')}\\n{get_value(ru, 'contact.response_time')}",
                    "body_en": f"{get_value(en, 'contact.working_hours')}\\n{get_value(en, 'contact.response_time')}",
                },
                {"type": "form", "form_slug": "contact"},
            ],
        },
        {
            "slug": "invest",
            "title": get_value(ru, "nav.invest"),
            "title_en": get_value(en, "nav.invest"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "nav.invest"),
                    "title_en": get_value(en, "nav.invest"),
                    "subtitle": get_value(ru, "invest.subtitle"),
                    "subtitle_en": get_value(en, "invest.subtitle"),
                },
                {
                    "type": "collection",
                    "title": get_value(ru, "nav.invest"),
                    "title_en": get_value(en, "nav.invest"),
                    "collection": "projects",
                    "limit": 0,
                },
            ],
        },
        {
            "slug": "partners",
            "title": get_value(ru, "nav.partners"),
            "title_en": get_value(en, "nav.partners"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "nav.partners"),
                    "title_en": get_value(en, "nav.partners"),
                    "subtitle": get_value(ru, "partners.subtitle"),
                    "subtitle_en": get_value(en, "partners.subtitle"),
                },
                {
                    "type": "collection",
                    "title": get_value(ru, "nav.partners"),
                    "title_en": get_value(en, "nav.partners"),
                    "collection": "partners",
                    "limit": 0,
                },
            ],
        },
        {
            "slug": "events",
            "title": get_value(ru, "nav.events"),
            "title_en": get_value(en, "nav.events"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "nav.events"),
                    "title_en": get_value(en, "nav.events"),
                    "subtitle": get_value(ru, "events.subtitle"),
                    "subtitle_en": get_value(en, "events.subtitle"),
                },
                {
                    "type": "collection",
                    "title": get_value(ru, "nav.events"),
                    "title_en": get_value(en, "nav.events"),
                    "collection": "events",
                    "limit": 0,
                },
            ],
        },
        {
            "slug": "cases",
            "title": get_value(ru, "nav.cases"),
            "title_en": get_value(en, "nav.cases"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "nav.cases"),
                    "title_en": get_value(en, "nav.cases"),
                    "subtitle": get_value(ru, "cases.subtitle"),
                    "subtitle_en": get_value(en, "cases.subtitle"),
                },
                {
                    "type": "collection",
                    "title": get_value(ru, "nav.cases"),
                    "title_en": get_value(en, "nav.cases"),
                    "collection": "cases",
                    "limit": 0,
                },
            ],
        },
        {
            "slug": "insights",
            "title": get_value(ru, "nav.insights"),
            "title_en": get_value(en, "nav.insights"),
            "blocks": [
                {
                    "type": "hero",
                    "title": get_value(ru, "nav.insights"),
                    "title_en": get_value(en, "nav.insights"),
                    "subtitle": get_value(ru, "insights.subtitle"),
                    "subtitle_en": get_value(en, "insights.subtitle"),
                },
                {
                    "type": "collection",
                    "title": get_value(ru, "nav.insights"),
                    "title_en": get_value(en, "nav.insights"),
                    "collection": "articles",
                    "limit": 0,
                },
            ],
        },
    ]

    for item in services:
        key_map = {
            "trade-manufacturing": "trade",
            "logistics-qc": "logistics",
            "corporate-travel-events": "travel",
            "investments-partnerships": "investments",
        }
        key = key_map[item["slug"]]
        process_ru = get_value(ru, f"service_detail.{key}.process", []) or []
        process_en = get_value(en, f"service_detail.{key}.process", []) or []
        packages_ru = get_value(ru, f"service_detail.{key}.packages", []) or []
        packages_en = get_value(en, f"service_detail.{key}.packages", []) or []
        pages.append(
            {
                "slug": f"service-{item['slug']}",
                "title": item["name_ru"],
                "title_en": item["name_en"],
                "blocks": [
                    {
                        "type": "hero",
                        "title": item["name_ru"],
                        "title_en": item["name_en"],
                        "subtitle": get_value(ru, f"service_detail.{key}.hero"),
                        "subtitle_en": get_value(en, f"service_detail.{key}.hero"),
                        "background_image": item["image"],
                    },
                    {
                        "type": "text",
                        "heading": get_value(ru, f"services.{key}.name"),
                        "heading_en": get_value(en, f"services.{key}.name"),
                        "body": get_value(ru, f"service_detail.{key}.description"),
                        "body_en": get_value(en, f"service_detail.{key}.description"),
                    },
                    {
                        "type": "list",
                        "title": get_value(ru, "service_detail.features_title"),
                        "title_en": get_value(en, "service_detail.features_title"),
                        "items": get_value(ru, f"service_detail.{key}.features", []),
                        "items_en": get_value(en, f"service_detail.{key}.features", []),
                    },
                    {
                        "type": "cards",
                        "title": get_value(ru, "service_detail.process_title"),
                        "title_en": get_value(en, "service_detail.process_title"),
                        "items": [
                            {
                                "title": step.get("step", ""),
                                "title_en": process_en[idx].get("step", "") if idx < len(process_en) else "",
                                "description": step.get("desc", ""),
                                "description_en": process_en[idx].get("desc", "") if idx < len(process_en) else "",
                            }
                            for idx, step in enumerate(process_ru)
                        ]
                    },
                    {
                        "type": "cards",
                        "title": get_value(ru, "service_detail.packages_title"),
                        "title_en": get_value(en, "service_detail.packages_title"),
                        "items": [
                            {
                                "title": pkg.get("name", ""),
                                "title_en": packages_en[idx].get("name", "") if idx < len(packages_en) else "",
                                "description": pkg.get("desc", ""),
                                "description_en": packages_en[idx].get("desc", "") if idx < len(packages_en) else "",
                            }
                            for idx, pkg in enumerate(packages_ru)
                        ],

                    },
                    {
                        "type": "cta",
                        "title": get_value(ru, "service_detail.ready_title"),
                        "title_en": get_value(en, "service_detail.ready_title"),
                        "body": get_value(ru, "service_detail.ready_desc"),
                        "body_en": get_value(en, "service_detail.ready_desc"),
                        "button_label": get_value(ru, "service_detail.contact_us"),
                        "button_label_en": get_value(en, "service_detail.contact_us"),
                        "button_href": "/contact",
                    },
                ],
            }
        )

    return pages


async def run():
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    ru = load_locale("ru")
    en = load_locale("en")
    pages = build_pages(ru, en)

    now = datetime.now(timezone.utc).isoformat()
    for page in pages:
        page.setdefault("id", page["slug"])
        page["updated_at"] = now
        await db.pages_dynamic.update_one(
            {"slug": page["slug"]},
            {"$set": page},
            upsert=True,
        )

    contact_form = {
        "id": "contact",
        "slug": "contact",
        "title": get_value(ru, "contact.form_title"),
        "title_en": get_value(en, "contact.form_title"),
        "submit_message": get_value(ru, "contact.success.title"),
        "submit_message_en": get_value(en, "contact.success.title"),
        "fields": [
            {"id": "name", "type": "text", "label": get_value(ru, "contact.form.name"), "label_en": get_value(en, "contact.form.name"), "required": True},
            {"id": "email", "type": "email", "label": get_value(ru, "contact.form.email"), "label_en": get_value(en, "contact.form.email"), "required": True},
            {"id": "company", "type": "text", "label": get_value(ru, "contact.form.company"), "label_en": get_value(en, "contact.form.company"), "required": False},
            {"id": "phone", "type": "tel", "label": get_value(ru, "contact.form.phone"), "label_en": get_value(en, "contact.form.phone"), "required": False},
            {"id": "service", "type": "text", "label": get_value(ru, "contact.form.service_label"), "label_en": get_value(en, "contact.form.service_label"), "required": False},
            {"id": "message", "type": "textarea", "label": get_value(ru, "contact.form.message"), "label_en": get_value(en, "contact.form.message"), "required": True},
        ],
        "updated_at": now,
    }
    await db.forms.update_one({"id": "contact"}, {"$set": contact_form}, upsert=True)

    # Copy static pages into dynamic pages as HTML blocks when present
    for slug in ["privacy", "terms", "nda", "download"]:
        static_page = await db.pages.find_one({"slug": slug}, {"_id": 0})
        if not static_page:
            continue
        html_block = {
            "type": "html",
            "html": static_page.get("content", ""),
            "html_en": static_page.get("content_en", ""),
        }
        dynamic_page = {
            "id": slug,
            "slug": slug,
            "title": static_page.get("title", slug),
            "title_en": static_page.get("title_en", slug),
            "updated_at": now,
            "blocks": [html_block],
        }
        await db.pages_dynamic.update_one(
            {"slug": slug},
            {"$set": dynamic_page},
            upsert=True,
        )

    client.close()
    print("Dynamic pages initialized.")


if __name__ == "__main__":
    asyncio.run(run())
