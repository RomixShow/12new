from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
from deep_translator import GoogleTranslator
import jwt
import bcrypt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Security
security = HTTPBearer()

# Auth Models
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    username: str
    password_hash: str
    created_at: str


# Define Models
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    name: str
    name_en: Optional[str] = None
    description: str
    description_en: Optional[str] = None
    image_url: str
    features: List[str]
    features_en: Optional[List[str]] = None

class CaseStudy(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    title_en: Optional[str] = None
    client: str
    category: str
    description: str
    description_en: Optional[str] = None
    challenge: str
    challenge_en: Optional[str] = None
    solution: str
    solution_en: Optional[str] = None
    results: List[str]
    results_en: Optional[List[str]] = None
    image_url: str
    created_at: str

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    title_en: Optional[str] = None
    date: str
    location: str
    location_en: Optional[str] = None
    type: str
    description: str
    description_en: Optional[str] = None
    program: List[dict]
    image_url: str

class InvestmentProject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    title_en: Optional[str] = None
    description: str
    description_en: Optional[str] = None
    stage: str
    industry: str
    country: str
    capital_required: str
    timeline: str
    status: str
    image_url: str

class Partner(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    name: str
    name_en: Optional[str] = None
    description: str
    description_en: Optional[str] = None
    categories: List[str]
    country: str
    logo_url: str

class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    title_en: Optional[str] = None
    excerpt: str
    excerpt_en: Optional[str] = None
    content: str
    content_en: Optional[str] = None
    author: str
    published_at: str
    image_url: str
    category: str

class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    name_en: Optional[str] = None
    position: str
    position_en: Optional[str] = None
    bio: str
    bio_en: Optional[str] = None
    image_url: str
    linkedin: Optional[str] = None

class StaticPage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str  # privacy, terms, nda, download
    title: str
    title_en: Optional[str] = None
    content: str  # HTML or markdown content
    content_en: Optional[str] = None
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactFormData(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str

class ContactForm(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# Routes
@api_router.get("/")
async def root():
    return {"message": "AICHIN GROUP API"}

# Auth functions
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth endpoints
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    """Login endpoint"""
    user = await db.users.find_one({"username": login_data.username}, {"_id": 0})
    if not user or not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token({"sub": user["username"], "user_id": user["id"]})
    return TokenResponse(access_token=access_token)

@api_router.post("/auth/verify")
async def verify_auth(payload: dict = Depends(verify_token)):
    """Verify token is valid"""
    return {"valid": True, "username": payload.get("sub")}

@api_router.post("/auth/create-user")
async def create_user(username: str, password: str):
    """Create new admin user - REMOVE THIS IN PRODUCTION or add protection"""
    existing = await db.users.find_one({"username": username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = {
        "id": str(uuid.uuid4()),
        "username": username,
        "password_hash": hash_password(password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    return {"message": "User created", "username": username}

# Translation utility
def auto_translate(text: str, source_lang: str = 'ru', target_lang: str = 'en') -> str:
    """Auto-translate text using Google Translate"""
    try:
        if not text or text.strip() == '':
            return text
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        return translator.translate(text)
    except Exception as e:
        logging.error(f"Translation error: {e}")
        return text

def auto_translate_list(items: List[str], source_lang: str = 'ru', target_lang: str = 'en') -> List[str]:
    """Auto-translate list of strings"""
    return [auto_translate(item, source_lang, target_lang) for item in items]

def add_translations(item: dict) -> dict:
    """Add English translations to an item if not present"""
    if 'name' in item and not item.get('name_en'):
        item['name_en'] = auto_translate(item['name'])
    if 'title' in item and not item.get('title_en'):
        item['title_en'] = auto_translate(item['title'])
    if 'description' in item and not item.get('description_en'):
        item['description_en'] = auto_translate(item['description'])
    if 'excerpt' in item and not item.get('excerpt_en'):
        item['excerpt_en'] = auto_translate(item['excerpt'])
    if 'content' in item and not item.get('content_en'):
        item['content_en'] = auto_translate(item['content'])
    if 'location' in item and not item.get('location_en'):
        item['location_en'] = auto_translate(item['location'])
    if 'challenge' in item and not item.get('challenge_en'):
        item['challenge_en'] = auto_translate(item['challenge'])
    if 'solution' in item and not item.get('solution_en'):
        item['solution_en'] = auto_translate(item['solution'])
    if 'features' in item and isinstance(item['features'], list) and not item.get('features_en'):
        item['features_en'] = auto_translate_list(item['features'])
    if 'results' in item and isinstance(item['results'], list) and not item.get('results_en'):
        item['results_en'] = auto_translate_list(item['results'])
    return item

# Services
@api_router.get("/services", response_model=List[Service])
async def get_services(lang: Optional[str] = 'en'):
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    # Auto-translate if English translations don't exist
    for service in services:
        if lang == 'en':
            service = add_translations(service)
    return services

@api_router.get("/services/{slug}", response_model=Service)
async def get_service(slug: str, lang: Optional[str] = 'en'):
    service = await db.services.find_one({"slug": slug}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    if lang == 'en':
        service = add_translations(service)
    return service

# Cases
@api_router.get("/cases", response_model=List[CaseStudy])
async def get_cases(category: Optional[str] = None, lang: Optional[str] = 'en'):
    query = {"category": category} if category else {}
    cases = await db.cases.find(query, {"_id": 0}).to_list(100)
    if lang == 'en':
        for case in cases:
            add_translations(case)
    return cases

@api_router.get("/cases/{slug}", response_model=CaseStudy)
async def get_case(slug: str, lang: Optional[str] = 'en'):
    case = await db.cases.find_one({"slug": slug}, {"_id": 0})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if lang == 'en':
        case = add_translations(case)
    return case

# Events
@api_router.get("/events", response_model=List[Event])
async def get_events(lang: Optional[str] = 'en'):
    events = await db.events.find({}, {"_id": 0}).to_list(100)
    if lang == 'en':
        for event in events:
            add_translations(event)
    return events

@api_router.get("/events/{slug}", response_model=Event)
async def get_event(slug: str, lang: Optional[str] = 'en'):
    event = await db.events.find_one({"slug": slug}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if lang == 'en':
        event = add_translations(event)
    return event

# Investment Projects
@api_router.get("/projects", response_model=List[InvestmentProject])
async def get_projects(stage: Optional[str] = None, industry: Optional[str] = None, lang: Optional[str] = 'en'):
    query = {}
    if stage:
        query["stage"] = stage
    if industry:
        query["industry"] = industry
    projects = await db.projects.find(query, {"_id": 0}).to_list(100)
    if lang == 'en':
        for project in projects:
            add_translations(project)
    return projects

@api_router.get("/projects/{slug}", response_model=InvestmentProject)
async def get_project(slug: str, lang: Optional[str] = 'en'):
    project = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if lang == 'en':
        project = add_translations(project)
    return project

# Partners
@api_router.get("/partners", response_model=List[Partner])
async def get_partners(category: Optional[str] = None, lang: Optional[str] = 'en'):
    query = {}
    if category:
        query["categories"] = category
    partners = await db.partners.find(query, {"_id": 0}).to_list(100)
    if lang == 'en':
        for partner in partners:
            add_translations(partner)
    return partners

@api_router.get("/partners/{slug}", response_model=Partner)
async def get_partner(slug: str, lang: Optional[str] = 'en'):
    partner = await db.partners.find_one({"slug": slug}, {"_id": 0})
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    if lang == 'en':
        partner = add_translations(partner)
    return partner

# Articles/Blog
@api_router.get("/articles", response_model=List[Article])
async def get_articles(category: Optional[str] = None, lang: Optional[str] = 'en'):
    query = {"category": category} if category else {}
    articles = await db.articles.find(query, {"_id": 0}).to_list(100)
    if lang == 'en':
        for article in articles:
            add_translations(article)
    return articles

@api_router.get("/articles/{slug}", response_model=Article)
async def get_article(slug: str, lang: Optional[str] = 'en'):
    article = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if lang == 'en':
        article = add_translations(article)
    return article

# Team
@api_router.get("/team", response_model=List[TeamMember])
async def get_team(lang: Optional[str] = 'en'):
    team = await db.team.find({}, {"_id": 0}).to_list(100)
    if lang == 'en':
        for member in team:
            add_translations(member)
    return team

# Static Pages (Privacy, Terms, NDA, Download)
@api_router.get("/pages")
async def get_all_pages(lang: Optional[str] = 'en'):
    pages = await db.pages.find({}, {"_id": 0}).to_list(100)
    if lang == 'en':
        for page in pages:
            add_translations(page)
    return pages

@api_router.get("/pages/{slug}")
async def get_page(slug: str, lang: Optional[str] = 'en'):
    page = await db.pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    if lang == 'en':
        page = add_translations(page)
    return page

# Contact Form
@api_router.post("/contact", response_model=ContactForm)
async def submit_contact_form(form_data: ContactFormData):
    contact = ContactForm(**form_data.model_dump())
    doc = contact.model_dump()
    await db.contact_forms.insert_one(doc)
    return contact

# Admin CRUD endpoints (Protected)
# Services CRUD
@api_router.post("/admin/services")
async def create_service(service: Service, payload: dict = Depends(verify_token)):
    doc = service.model_dump()
    await db.services.insert_one(doc)
    return {"message": "Service created", "id": service.id}

@api_router.put("/admin/services/{service_id}")
async def update_service(service_id: str, service: Service, payload: dict = Depends(verify_token)):
    doc = service.model_dump()
    result = await db.services.update_one({"id": service_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service updated"}

@api_router.delete("/admin/services/{service_id}")
async def delete_service(service_id: str, payload: dict = Depends(verify_token)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted"}

# Cases CRUD
@api_router.post("/admin/cases")
async def create_case(case: CaseStudy, payload: dict = Depends(verify_token)):
    doc = case.model_dump()
    await db.cases.insert_one(doc)
    return {"message": "Case created", "id": case.id}

@api_router.put("/admin/cases/{case_id}")
async def update_case(case_id: str, case: CaseStudy, payload: dict = Depends(verify_token)):
    doc = case.model_dump()
    result = await db.cases.update_one({"id": case_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")
    return {"message": "Case updated"}

@api_router.delete("/admin/cases/{case_id}")
async def delete_case(case_id: str, payload: dict = Depends(verify_token)):
    result = await db.cases.delete_one({"id": case_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")
    return {"message": "Case deleted"}

# Events CRUD
@api_router.post("/admin/events")
async def create_event(event: Event, payload: dict = Depends(verify_token)):
    doc = event.model_dump()
    await db.events.insert_one(doc)
    return {"message": "Event created", "id": event.id}

@api_router.put("/admin/events/{event_id}")
async def update_event(event_id: str, event: Event, payload: dict = Depends(verify_token)):
    doc = event.model_dump()
    result = await db.events.update_one({"id": event_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated"}

@api_router.delete("/admin/events/{event_id}")
async def delete_event(event_id: str, payload: dict = Depends(verify_token)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}

# Projects CRUD
@api_router.post("/admin/projects")
async def create_project(project: InvestmentProject, payload: dict = Depends(verify_token)):
    doc = project.model_dump()
    await db.projects.insert_one(doc)
    return {"message": "Project created", "id": project.id}

@api_router.put("/admin/projects/{project_id}")
async def update_project(project_id: str, project: InvestmentProject, payload: dict = Depends(verify_token)):
    doc = project.model_dump()
    result = await db.projects.update_one({"id": project_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project updated"}

@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, payload: dict = Depends(verify_token)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

# Partners CRUD
@api_router.post("/admin/partners")
async def create_partner(partner: Partner, payload: dict = Depends(verify_token)):
    doc = partner.model_dump()
    await db.partners.insert_one(doc)
    return {"message": "Partner created", "id": partner.id}

@api_router.put("/admin/partners/{partner_id}")
async def update_partner(partner_id: str, partner: Partner, payload: dict = Depends(verify_token)):
    doc = partner.model_dump()
    result = await db.partners.update_one({"id": partner_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"message": "Partner updated"}

@api_router.delete("/admin/partners/{partner_id}")
async def delete_partner(partner_id: str, payload: dict = Depends(verify_token)):
    result = await db.partners.delete_one({"id": partner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"message": "Partner deleted"}

# Articles CRUD
@api_router.post("/admin/articles")
async def create_article(article: Article, payload: dict = Depends(verify_token)):
    doc = article.model_dump()
    await db.articles.insert_one(doc)
    return {"message": "Article created", "id": article.id}

@api_router.put("/admin/articles/{article_id}")
async def update_article(article_id: str, article: Article, payload: dict = Depends(verify_token)):
    doc = article.model_dump()
    result = await db.articles.update_one({"id": article_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article updated"}

@api_router.delete("/admin/articles/{article_id}")
async def delete_article(article_id: str, payload: dict = Depends(verify_token)):
    result = await db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted"}

# Team CRUD
@api_router.post("/admin/team")
async def create_team_member(member: TeamMember, payload: dict = Depends(verify_token)):
    doc = member.model_dump()
    await db.team.insert_one(doc)
    return {"message": "Team member created", "id": member.id}

@api_router.put("/admin/team/{member_id}")
async def update_team_member(member_id: str, member: TeamMember, payload: dict = Depends(verify_token)):
    doc = member.model_dump()
    result = await db.team.update_one({"id": member_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member updated"}

@api_router.delete("/admin/team/{member_id}")
async def delete_team_member(member_id: str, payload: dict = Depends(verify_token)):
    result = await db.team.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member deleted"}

# Static Pages CRUD
@api_router.post("/admin/pages")
async def create_page(page: StaticPage, payload: dict = Depends(verify_token)):
    doc = page.model_dump()
    doc = add_translations(doc)
    await db.pages.insert_one(doc)
    return {"message": "Page created", "id": page.id}

@api_router.put("/admin/pages/{page_id}")
async def update_page(page_id: str, page: StaticPage, payload: dict = Depends(verify_token)):
    doc = page.model_dump()
    doc['updated_at'] = datetime.now(timezone.utc).isoformat()
    doc = add_translations(doc)
    result = await db.pages.update_one({"id": page_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page updated"}

@api_router.delete("/admin/pages/{page_id}")
async def delete_page(page_id: str, payload: dict = Depends(verify_token)):
    result = await db.pages.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page deleted"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()