from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
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
import shutil
import re


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)
FONTS_DIR = ROOT_DIR.parent / "frontend" / "public" / "fonts"

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

SETTINGS_ID = "main"

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
    role: str = "admin"  # admin, superadmin
    created_at: str

class CreateUserRequest(BaseModel):
    username: str
    password: str
    role: str = "admin"

class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class AdminChangePasswordRequest(BaseModel):
    new_password: str


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


class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    label: str
    label_en: Optional[str] = None
    href: str
    children: Optional[List["MenuItem"]] = None


class FooterLink(BaseModel):
    model_config = ConfigDict(extra="ignore")
    label: str
    label_en: Optional[str] = None
    href: str


class FooterSection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    title_en: Optional[str] = None
    links: List[FooterLink] = Field(default_factory=list)


class FooterSocial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    label: str
    href: str


class SiteHeader(BaseModel):
    model_config = ConfigDict(extra="ignore")
    logo_text: str
    logo_tagline: str
    cta_label: str
    cta_label_en: Optional[str] = None
    cta_href: str
    menu: List[MenuItem] = Field(default_factory=list)


class SiteFooter(BaseModel):
    model_config = ConfigDict(extra="ignore")
    address: str
    address_en: Optional[str] = None
    email: str
    phone: Optional[str] = None
    sections: List[FooterSection] = Field(default_factory=list)
    socials: List[FooterSocial] = Field(default_factory=list)


class ThemeSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    primary: str
    secondary: str
    accent: str
    background: str
    foreground: str
    heading_font: str
    body_font: str


class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    header: SiteHeader
    footer: SiteFooter
    theme: ThemeSettings
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class DynamicPage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    title_en: Optional[str] = None
    blocks: List[Dict] = Field(default_factory=list)
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FormField(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    type: str
    label: str
    label_en: Optional[str] = None
    required: bool = False
    options: Optional[List[str]] = None
    options_en: Optional[List[str]] = None


class FormDefinition(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    title_en: Optional[str] = None
    fields: List[FormField] = Field(default_factory=list)
    submit_message: Optional[str] = None
    submit_message_en: Optional[str] = None
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FormSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    form_id: str
    payload: Dict
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class MediaItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    url: str
    filename: str
    original_name: Optional[str] = None
    content_type: Optional[str] = None
    size: Optional[int] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


MenuItem.model_rebuild()


# Routes
@api_router.get("/")
async def root():
    return {"message": "AICHIN GROUP API"}


@api_router.get("/settings")
async def get_settings():
    return await get_or_create_settings()


@api_router.get("/fonts")
async def list_fonts():
    if not FONTS_DIR.exists():
        return []
    fonts = []
    for entry in FONTS_DIR.iterdir():
        if not entry.is_file():
            continue
        parsed = parse_font_filename(entry.name)
        if not parsed:
            continue
        fonts.append({
            "family": parsed["family"],
            "weight": parsed["weight"],
            "url": f"/fonts/{entry.name}",
        })
    fonts.sort(key=lambda f: (f["family"].lower(), f["weight"]))
    return fonts

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
    
    role = user.get("role", "admin")
    access_token = create_access_token({"sub": user["username"], "user_id": user["id"], "role": role})
    return TokenResponse(access_token=access_token)

@api_router.post("/auth/verify")
async def verify_auth(payload: dict = Depends(verify_token)):
    """Verify token is valid"""
    return {"valid": True, "username": payload.get("sub"), "role": payload.get("role", "admin")}

@api_router.post("/auth/change-password")
async def change_password(data: ChangePasswordRequest, payload: dict = Depends(verify_token)):
    """Change own password"""
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(data.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    new_hash = hash_password(data.new_password)
    await db.users.update_one({"id": payload["user_id"]}, {"$set": {"password_hash": new_hash}})
    return {"message": "Password changed successfully"}

# Admin user management
@api_router.get("/admin/users")
async def get_users(payload: dict = Depends(verify_token)):
    """Get all admin users (superadmin only)"""
    if payload.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Access denied. Superadmin only.")
    
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(100)
    return users

@api_router.post("/admin/users")
async def create_admin_user(data: CreateUserRequest, payload: dict = Depends(verify_token)):
    """Create new admin user (superadmin only)"""
    if payload.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Access denied. Superadmin only.")
    
    existing = await db.users.find_one({"username": data.username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = {
        "id": str(uuid.uuid4()),
        "username": data.username,
        "password_hash": hash_password(data.password),
        "role": data.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    return {"message": "User created", "id": user["id"], "username": data.username}

@api_router.put("/admin/users/{user_id}")
async def update_admin_user(user_id: str, data: UpdateUserRequest, payload: dict = Depends(verify_token)):
    """Update admin user (superadmin only)"""
    if payload.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Access denied. Superadmin only.")
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {}
    if data.username:
        # Check if new username already exists
        existing = await db.users.find_one({"username": data.username, "id": {"$ne": user_id}})
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        update_data["username"] = data.username
    if data.role:
        update_data["role"] = data.role
    
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    return {"message": "User updated"}

@api_router.put("/admin/users/{user_id}/password")
async def reset_user_password(user_id: str, data: AdminChangePasswordRequest, payload: dict = Depends(verify_token)):
    """Reset user password (superadmin only)"""
    if payload.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Access denied. Superadmin only.")
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_hash = hash_password(data.new_password)
    await db.users.update_one({"id": user_id}, {"$set": {"password_hash": new_hash}})
    return {"message": "Password reset successfully"}

@api_router.delete("/admin/users/{user_id}")
async def delete_admin_user(user_id: str, payload: dict = Depends(verify_token)):
    """Delete admin user (superadmin only)"""
    if payload.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Access denied. Superadmin only.")
    
    # Prevent deleting self
    if payload["user_id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

# Site Settings (Admin)
@api_router.get("/admin/settings")
async def get_admin_settings(payload: dict = Depends(verify_token)):
    return await get_or_create_settings()

@api_router.put("/admin/settings")
async def update_admin_settings(settings: SiteSettings, payload: dict = Depends(verify_token)):
    doc = settings.model_dump()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.site_settings.update_one({"id": SETTINGS_ID}, {"$set": doc}, upsert=True)
    if result.matched_count == 0 and not result.upserted_id:
        raise HTTPException(status_code=404, detail="Settings not found")
    return {"message": "Settings updated"}

# Dynamic Pages (Admin)
@api_router.get("/admin/pages-dynamic")
async def get_admin_dynamic_pages(payload: dict = Depends(verify_token)):
    pages = await db.pages_dynamic.find({}, {"_id": 0}).to_list(200)
    return pages

@api_router.post("/admin/pages-dynamic")
async def create_dynamic_page(page: DynamicPage, payload: dict = Depends(verify_token)):
    doc = page.model_dump()
    doc = add_dynamic_page_translations(doc)
    await db.pages_dynamic.insert_one(doc)
    return {"message": "Page created", "id": page.id}

@api_router.put("/admin/pages-dynamic/{page_id}")
async def update_dynamic_page(page_id: str, page: DynamicPage, payload: dict = Depends(verify_token)):
    doc = page.model_dump()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    doc = add_dynamic_page_translations(doc)
    result = await db.pages_dynamic.update_one({"id": page_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page updated"}

@api_router.delete("/admin/pages-dynamic/{page_id}")
async def delete_dynamic_page(page_id: str, payload: dict = Depends(verify_token)):
    result = await db.pages_dynamic.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page deleted"}

# Forms (Admin)
@api_router.get("/admin/forms")
async def get_admin_forms(payload: dict = Depends(verify_token)):
    forms = await db.forms.find({}, {"_id": 0}).to_list(200)
    return forms

@api_router.post("/admin/forms")
async def create_form(form: FormDefinition, payload: dict = Depends(verify_token)):
    doc = form.model_dump()
    doc = add_form_translations(doc)
    await db.forms.insert_one(doc)
    return {"message": "Form created", "id": form.id}

@api_router.put("/admin/forms/{form_id}")
async def update_form(form_id: str, form: FormDefinition, payload: dict = Depends(verify_token)):
    doc = form.model_dump()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    doc = add_form_translations(doc)
    result = await db.forms.update_one({"id": form_id}, {"$set": doc})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Form updated"}

@api_router.delete("/admin/forms/{form_id}")
async def delete_form(form_id: str, payload: dict = Depends(verify_token)):
    result = await db.forms.delete_one({"id": form_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Form deleted"}

# Form submissions (Admin)
@api_router.get("/admin/submissions")
async def get_form_submissions(form_id: Optional[str] = None, payload: dict = Depends(verify_token)):
    query = {"form_id": form_id} if form_id else {}
    submissions = await db.form_submissions.find(query, {"_id": 0}).to_list(500)
    return submissions

# Media (Admin)
@api_router.get("/admin/media")
async def get_media(payload: dict = Depends(verify_token)):
    media = await db.media.find({}, {"_id": 0}).to_list(500)
    return media

@api_router.post("/admin/media")
async def upload_media(file: UploadFile = File(...), payload: dict = Depends(verify_token)):
    original_name = file.filename or "upload"
    extension = Path(original_name).suffix
    stored_name = f"{uuid.uuid4().hex}{extension}"
    target_path = UPLOADS_DIR / stored_name
    with target_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    size = target_path.stat().st_size if target_path.exists() else None
    media = MediaItem(
        id=str(uuid.uuid4()),
        url=f"/uploads/{stored_name}",
        filename=stored_name,
        original_name=original_name,
        content_type=file.content_type,
        size=size,
    )
    await db.media.insert_one(media.model_dump())
    return media

@api_router.delete("/admin/media/{media_id}")
async def delete_media(media_id: str, payload: dict = Depends(verify_token)):
    media = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    filename = media.get("filename")
    if filename:
        file_path = UPLOADS_DIR / filename
        if file_path.exists():
            file_path.unlink()
    await db.media.delete_one({"id": media_id})
    return {"message": "Media deleted"}

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


def add_dynamic_page_translations(page: dict) -> dict:
    if not page.get("title_en") and page.get("title"):
        page["title_en"] = auto_translate(page["title"])
    blocks = page.get("blocks") or []
    translated_blocks = []
    for block in blocks:
        b = dict(block)
        block_type = b.get("type")
        if block_type == "hero":
            if b.get("title") and not b.get("title_en"):
                b["title_en"] = auto_translate(b["title"])
            if b.get("subtitle") and not b.get("subtitle_en"):
                b["subtitle_en"] = auto_translate(b["subtitle"])
            if b.get("cta_label") and not b.get("cta_label_en"):
                b["cta_label_en"] = auto_translate(b["cta_label"])
        elif block_type == "text":
            if b.get("heading") and not b.get("heading_en"):
                b["heading_en"] = auto_translate(b["heading"])
            if b.get("body") and not b.get("body_en"):
                b["body_en"] = auto_translate(b["body"])
        elif block_type == "image":
            if b.get("caption") and not b.get("caption_en"):
                b["caption_en"] = auto_translate(b["caption"])
        elif block_type == "video":
            if b.get("title") and not b.get("title_en"):
                b["title_en"] = auto_translate(b["title"])
        elif block_type == "cards":
            if b.get("title") and not b.get("title_en"):
                b["title_en"] = auto_translate(b["title"])
            items = b.get("items") or []
            translated_items = []
            for item in items:
                i = dict(item)
                if i.get("title") and not i.get("title_en"):
                    i["title_en"] = auto_translate(i["title"])
                if i.get("description") and not i.get("description_en"):
                    i["description_en"] = auto_translate(i["description"])
                translated_items.append(i)
            b["items"] = translated_items
        elif block_type == "stats":
            items = b.get("items") or []
            translated_items = []
            for item in items:
                i = dict(item)
                if i.get("label") and not i.get("label_en"):
                    i["label_en"] = auto_translate(i["label"])
                translated_items.append(i)
            b["items"] = translated_items
        elif block_type == "cta":
            if b.get("title") and not b.get("title_en"):
                b["title_en"] = auto_translate(b["title"])
            if b.get("body") and not b.get("body_en"):
                b["body_en"] = auto_translate(b["body"])
            if b.get("button_label") and not b.get("button_label_en"):
                b["button_label_en"] = auto_translate(b["button_label"])
        elif block_type == "list":
            if b.get("title") and not b.get("title_en"):
                b["title_en"] = auto_translate(b["title"])
            if b.get("items") and not b.get("items_en"):
                b["items_en"] = auto_translate_list(b["items"])
        elif block_type == "collection":
            if b.get("title") and not b.get("title_en"):
                b["title_en"] = auto_translate(b["title"])
        translated_blocks.append(b)
    page["blocks"] = translated_blocks
    return page


def add_form_translations(form: dict) -> dict:
    if not form.get("title_en") and form.get("title"):
        form["title_en"] = auto_translate(form["title"])
    if not form.get("submit_message_en") and form.get("submit_message"):
        form["submit_message_en"] = auto_translate(form["submit_message"])
    fields = form.get("fields") or []
    translated_fields = []
    for field in fields:
        f = dict(field)
        if f.get("label") and not f.get("label_en"):
            f["label_en"] = auto_translate(f["label"])
        if f.get("options") and not f.get("options_en"):
            f["options_en"] = auto_translate_list(f["options"])
        translated_fields.append(f)
    form["fields"] = translated_fields
    return form


def parse_font_filename(filename: str) -> Optional[Dict]:
    suffix = Path(filename).suffix.lower()
    if suffix not in {".ttf", ".otf", ".woff", ".woff2"}:
        return None
    base = Path(filename).stem
    tokens = re.split(r"[-_]", base)
    weight_map = {
        "thin": 100,
        "extralight": 200,
        "light": 300,
        "regular": 400,
        "book": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700,
        "extrabold": 800,
        "black": 900,
    }
    weight = 400
    if tokens and tokens[-1].lower() in weight_map:
        weight = weight_map[tokens[-1].lower()]
        tokens = tokens[:-1]
    family_raw = " ".join(tokens) if tokens else base
    family = re.sub(r"(?<!^)(?=[A-Z0-9])", " ", family_raw).strip()
    return {"family": family, "weight": weight, "file": filename}

def default_site_settings() -> dict:
    return SiteSettings(
        id=SETTINGS_ID,
        header=SiteHeader(
            logo_text="AICHIN",
            logo_tagline="GROUP",
            cta_label="Request",
            cta_label_en="Request",
            cta_href="/contact",
            menu=[],
        ),
        footer=SiteFooter(
            address="",
            address_en="",
            email="",
            phone="",
            sections=[],
            socials=[],
        ),
        theme=ThemeSettings(
            primary="#E11D2E",
            secondary="#0A0A0A",
            accent="#FFFFFF",
            background="#050505",
            foreground="#FFFFFF",
            heading_font="Roboto",
            body_font="Arial",
        ),
    ).model_dump()


async def get_or_create_settings() -> dict:
    settings = await db.site_settings.find_one({"id": SETTINGS_ID}, {"_id": 0})
    if settings:
        return settings
    settings = default_site_settings()
    await db.site_settings.insert_one(settings)
    return settings

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

# Dynamic Pages
@api_router.get("/pages-dynamic")
async def get_dynamic_pages():
    pages = await db.pages_dynamic.find({}, {"_id": 0}).to_list(200)
    return pages

@api_router.get("/pages-dynamic/{slug}")
async def get_dynamic_page(slug: str):
    page = await db.pages_dynamic.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

# Contact Form
@api_router.post("/contact", response_model=ContactForm)
async def submit_contact_form(form_data: ContactFormData):
    contact = ContactForm(**form_data.model_dump())
    doc = contact.model_dump()
    await db.contact_forms.insert_one(doc)
    return contact

# Dynamic Forms
@api_router.get("/forms/{slug}")
async def get_form(slug: str):
    form = await db.forms.find_one({"slug": slug}, {"_id": 0})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

@api_router.post("/forms/{slug}/submit")
async def submit_form(slug: str, payload: Dict):
    form = await db.forms.find_one({"slug": slug}, {"_id": 0})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    submission = FormSubmission(form_id=form["id"], payload=payload)
    await db.form_submissions.insert_one(submission.model_dump())
    return {"message": "Submission stored"}

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
