from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


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


# Define Models
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    name: str
    description: str
    image_url: str
    features: List[str]

class CaseStudy(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    client: str
    category: str
    description: str
    challenge: str
    solution: str
    results: List[str]
    image_url: str
    created_at: str

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    date: str
    location: str
    type: str
    description: str
    program: List[dict]
    image_url: str

class InvestmentProject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    description: str
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
    description: str
    categories: List[str]
    country: str
    logo_url: str

class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    excerpt: str
    content: str
    author: str
    published_at: str
    image_url: str
    category: str

class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    position: str
    bio: str
    image_url: str
    linkedin: Optional[str] = None

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

# Services
@api_router.get("/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    return services

@api_router.get("/services/{slug}", response_model=Service)
async def get_service(slug: str):
    service = await db.services.find_one({"slug": slug}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

# Cases
@api_router.get("/cases", response_model=List[CaseStudy])
async def get_cases(category: Optional[str] = None):
    query = {"category": category} if category else {}
    cases = await db.cases.find(query, {"_id": 0}).to_list(100)
    return cases

@api_router.get("/cases/{slug}", response_model=CaseStudy)
async def get_case(slug: str):
    case = await db.cases.find_one({"slug": slug}, {"_id": 0})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

# Events
@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find({}, {"_id": 0}).to_list(100)
    return events

@api_router.get("/events/{slug}", response_model=Event)
async def get_event(slug: str):
    event = await db.events.find_one({"slug": slug}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# Investment Projects
@api_router.get("/projects", response_model=List[InvestmentProject])
async def get_projects(stage: Optional[str] = None, industry: Optional[str] = None):
    query = {}
    if stage:
        query["stage"] = stage
    if industry:
        query["industry"] = industry
    projects = await db.projects.find(query, {"_id": 0}).to_list(100)
    return projects

@api_router.get("/projects/{slug}", response_model=InvestmentProject)
async def get_project(slug: str):
    project = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# Partners
@api_router.get("/partners", response_model=List[Partner])
async def get_partners(category: Optional[str] = None):
    query = {}
    if category:
        query["categories"] = category
    partners = await db.partners.find(query, {"_id": 0}).to_list(100)
    return partners

@api_router.get("/partners/{slug}", response_model=Partner)
async def get_partner(slug: str):
    partner = await db.partners.find_one({"slug": slug}, {"_id": 0})
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    return partner

# Articles/Blog
@api_router.get("/articles", response_model=List[Article])
async def get_articles(category: Optional[str] = None):
    query = {"category": category} if category else {}
    articles = await db.articles.find(query, {"_id": 0}).to_list(100)
    return articles

@api_router.get("/articles/{slug}", response_model=Article)
async def get_article(slug: str):
    article = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

# Team
@api_router.get("/team", response_model=List[TeamMember])
async def get_team():
    team = await db.team.find({}, {"_id": 0}).to_list(100)
    return team

# Contact Form
@api_router.post("/contact", response_model=ContactForm)
async def submit_contact_form(form_data: ContactFormData):
    contact = ContactForm(**form_data.model_dump())
    doc = contact.model_dump()
    await db.contact_forms.insert_one(doc)
    return contact

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