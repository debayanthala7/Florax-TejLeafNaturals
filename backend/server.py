from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import uuid
import jwt
import resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---------- Setup ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'change_me')
JWT_ALG = 'HS256'
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@florax.in')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Florax@Sikkim2025')

resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT = os.environ.get('CONTACT_RECIPIENT', 'hello@florax.in')

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="FLORAX API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Models ----------
def now_utc_iso():
    return datetime.now(timezone.utc).isoformat()


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    category: str  # produce, herbs, biotech-inputs, wellness
    price: float
    unit: str = "pack"
    short_description: str
    description: str
    image: str
    stock: int = 50
    featured: bool = False
    created_at: str = Field(default_factory=now_utc_iso)


class ProductCreate(BaseModel):
    name: str
    slug: str
    category: str
    price: float
    unit: str = "pack"
    short_description: str
    description: str
    image: str
    stock: int = 50
    featured: bool = False


class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image: str
    author: str = "FLORAX Editorial"
    tag: str = "Field Notes"
    published_at: str = Field(default_factory=now_utc_iso)


class BlogCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image: str
    author: str = "FLORAX Editorial"
    tag: str = "Field Notes"


class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    created_at: str = Field(default_factory=now_utc_iso)
    status: str = "new"


class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


class PartnerApp(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    village: str
    district: str
    farm_size_acres: float
    crops: str
    notes: Optional[str] = ""
    created_at: str = Field(default_factory=now_utc_iso)
    status: str = "pending"


class PartnerAppCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    village: str
    district: str
    farm_size_acres: float
    crops: str
    notes: Optional[str] = ""


class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image: str


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    state: str
    pincode: str
    items: List[OrderItem]
    subtotal: float
    shipping: float = 80.0
    total: float
    notes: Optional[str] = ""
    status: str = "placed"
    created_at: str = Field(default_factory=now_utc_iso)


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    state: str
    pincode: str
    items: List[OrderItem]
    notes: Optional[str] = ""


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class StatusUpdate(BaseModel):
    status: str


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class CustomerSignup(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    password: str


# ---------- Auth ----------
def create_token(email: str) -> str:
    payload = {"sub": email, "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def require_admin(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    email = payload.get("sub")
    admin = await db.admins.find_one({"email": email}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin


# ---------- Email ----------
async def send_inquiry_email(inq: Inquiry):
    if not resend.api_key or resend.api_key.startswith("re_placeholder"):
        logger.warning("Resend API key not configured. Skipping email send.")
        return None
    html = f"""
    <table style="font-family: Arial, sans-serif; width:100%; max-width:600px;">
      <tr><td style="padding:16px; background:#2C3B2E; color:#F7F5F0;">
        <h2 style="margin:0;">New FLORAX Inquiry</h2>
      </td></tr>
      <tr><td style="padding:16px; background:#F7F5F0; color:#1A1A1A;">
        <p><b>Name:</b> {inq.name}</p>
        <p><b>Email:</b> {inq.email}</p>
        <p><b>Phone:</b> {inq.phone or '-'}</p>
        <p><b>Subject:</b> {inq.subject}</p>
        <p><b>Message:</b><br/>{inq.message}</p>
      </td></tr>
    </table>
    """
    params = {
        "from": SENDER_EMAIL,
        "to": [CONTACT_RECIPIENT],
        "reply_to": inq.email,
        "subject": f"[FLORAX] {inq.subject}",
        "html": html,
    }
    try:
        return await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        return None


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "FLORAX API", "status": "ok"}


# Products
@api_router.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None):
    q = {}
    if category:
        q["category"] = category
    if featured is not None:
        q["featured"] = featured
    docs = await db.products.find(q, {"_id": 0}).to_list(500)
    return docs


@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc


@api_router.post("/products", response_model=Product)
async def create_product(payload: ProductCreate, admin=Depends(require_admin)):
    p = Product(**payload.model_dump())
    await db.products.insert_one(p.model_dump())
    return p


@api_router.put("/products/{pid}", response_model=Product)
async def update_product(pid: str, payload: ProductCreate, admin=Depends(require_admin)):
    existing = await db.products.find_one({"id": pid}, {"_id": 0})
    if not existing:
        raise HTTPException(404, "Not found")
    updated = {**existing, **payload.model_dump()}
    await db.products.update_one({"id": pid}, {"$set": payload.model_dump()})
    return Product(**updated)


@api_router.delete("/products/{pid}")
async def delete_product(pid: str, admin=Depends(require_admin)):
    res = await db.products.delete_one({"id": pid})
    return {"deleted": res.deleted_count}


# Blog
@api_router.get("/blog", response_model=List[BlogPost])
async def list_blog():
    docs = await db.blog.find({}, {"_id": 0}).sort("published_at", -1).to_list(200)
    return docs


@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog(slug: str):
    doc = await db.blog.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Not found")
    return doc


@api_router.post("/blog", response_model=BlogPost)
async def create_blog(payload: BlogCreate, admin=Depends(require_admin)):
    b = BlogPost(**payload.model_dump())
    await db.blog.insert_one(b.model_dump())
    return b


@api_router.delete("/blog/{bid}")
async def delete_blog(bid: str, admin=Depends(require_admin)):
    res = await db.blog.delete_one({"id": bid})
    return {"deleted": res.deleted_count}


# Inquiries
@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(payload: InquiryCreate):
    inq = Inquiry(**payload.model_dump())
    await db.inquiries.insert_one(inq.model_dump())
    await send_inquiry_email(inq)
    return inq


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries(admin=Depends(require_admin)):
    docs = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.patch("/inquiries/{iid}")
async def update_inquiry_status(iid: str, payload: StatusUpdate, admin=Depends(require_admin)):
    await db.inquiries.update_one({"id": iid}, {"$set": {"status": payload.status}})
    return {"ok": True}


# Partner Applications
@api_router.post("/partners", response_model=PartnerApp)
async def apply_partner(payload: PartnerAppCreate):
    app_doc = PartnerApp(**payload.model_dump())
    await db.partners.insert_one(app_doc.model_dump())
    return app_doc


@api_router.get("/partners", response_model=List[PartnerApp])
async def list_partners(admin=Depends(require_admin)):
    docs = await db.partners.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.patch("/partners/{pid}")
async def update_partner_status(pid: str, payload: StatusUpdate, admin=Depends(require_admin)):
    await db.partners.update_one({"id": pid}, {"$set": {"status": payload.status}})
    return {"ok": True}


# Orders
@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    subtotal = sum(i.price * i.quantity for i in payload.items)
    shipping = 80.0 if subtotal < 1500 else 0.0
    total = subtotal + shipping
    order = Order(**payload.model_dump(), subtotal=subtotal, shipping=shipping, total=total)
    await db.orders.insert_one(order.model_dump())
    return order


@api_router.get("/orders", response_model=List[Order])
async def list_orders(admin=Depends(require_admin)):
    docs = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.patch("/orders/{oid}")
async def update_order_status(oid: str, payload: StatusUpdate, admin=Depends(require_admin)):
    await db.orders.update_one({"id": oid}, {"$set": {"status": payload.status}})
    return {"ok": True}


# Admin auth
@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    admin = await db.admins.find_one({"email": payload.email}, {"_id": 0})
    if not admin or not pwd_ctx.verify(payload.password, admin["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_token(payload.email)
    return {"token": token, "email": payload.email}


@api_router.get("/admin/me")
async def admin_me(admin=Depends(require_admin)):
    return {"email": admin["email"]}


@api_router.get("/admin/stats")
async def admin_stats(admin=Depends(require_admin)):
    return {
        "products": await db.products.count_documents({}),
        "blog": await db.blog.count_documents({}),
        "inquiries": await db.inquiries.count_documents({}),
        "inquiries_new": await db.inquiries.count_documents({"status": "new"}),
        "partners": await db.partners.count_documents({}),
        "partners_pending": await db.partners.count_documents({"status": "pending"}),
        "orders": await db.orders.count_documents({}),
        "orders_placed": await db.orders.count_documents({"status": "placed"}),
    }


# Newsletter
@api_router.post("/newsletter/subscribe")
async def newsletter_subscribe(payload: NewsletterSubscribe):
    existing = await db.newsletter.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        return {"ok": True, "already": True}
    await db.newsletter.insert_one({
        "email": payload.email,
        "subscribed_at": now_utc_iso(),
    })
    return {"ok": True, "already": False}


# Customer accounts
@api_router.post("/users/register")
async def user_register(payload: CustomerSignup):
    existing = await db.customers.find_one({"email": payload.email})
    if existing:
        raise HTTPException(409, "Account already exists")
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone or "",
        "password_hash": pwd_ctx.hash(payload.password),
        "created_at": now_utc_iso(),
    }
    await db.customers.insert_one(doc)
    token = create_token(payload.email)
    return {"token": token, "name": payload.name, "email": payload.email}


@api_router.post("/users/login")
async def user_login(payload: AdminLogin):
    user = await db.customers.find_one({"email": payload.email}, {"_id": 0})
    if not user or not pwd_ctx.verify(payload.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_token(payload.email)
    return {"token": token, "name": user["name"], "email": payload.email}


# ---------- Seed ----------
SEED_PRODUCTS = [
    {
        "name": "FLORAX Sikkim Large Cardamom",
        "slug": "sikkim-large-cardamom",
        "category": "herbs",
        "price": 549.0,
        "unit": "100 g",
        "short_description": "Smoke-cured pods from terraced Himalayan farms.",
        "description": "Hand-harvested at 1500 m, our Large Cardamom carries a deep camphor-pine aroma cured over alder wood. Single-origin, tested for purity in our Gangtok lab.",
        "image": "https://images.pexels.com/photos/27177517/pexels-photo-27177517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 60,
        "featured": True,
    },
    {
        "name": "Wildcrafted Buckwheat Honey",
        "slug": "wildcrafted-buckwheat-honey",
        "category": "produce",
        "price": 749.0,
        "unit": "350 g jar",
        "short_description": "Dark, malty honey from monastery foothill apiaries.",
        "description": "Cold-strained from buckwheat blooms above Pelling. Rich molasses notes; never heated above 35°C.",
        "image": "https://images.pexels.com/photos/18864061/pexels-photo-18864061.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 40,
        "featured": True,
    },
    {
        "name": "Himalayan Turmeric (Curcumin 6%)",
        "slug": "himalayan-turmeric",
        "category": "herbs",
        "price": 320.0,
        "unit": "200 g",
        "short_description": "Lab-verified high curcumin organic turmeric.",
        "description": "Stone-ground at low temperatures to retain volatile oils. Curcumin content verified at 6.2% by HPLC at our R&D facility.",
        "image": "https://images.pexels.com/photos/8851404/pexels-photo-8851404.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 80,
        "featured": True,
    },
    {
        "name": "FLORAX Bio-Compost Activator",
        "slug": "florax-bio-compost-activator",
        "category": "biotech-inputs",
        "price": 280.0,
        "unit": "500 g",
        "short_description": "Microbial consortium for faster, richer compost.",
        "description": "Proprietary consortium of Trichoderma, Pseudomonas and indigenous Sikkim soil microbes. Cuts composting time by ~40%.",
        "image": "https://images.pexels.com/photos/8220089/pexels-photo-8220089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 120,
        "featured": False,
    },
    {
        "name": "Stinging Nettle Bio-Tonic",
        "slug": "stinging-nettle-bio-tonic",
        "category": "biotech-inputs",
        "price": 410.0,
        "unit": "1 L concentrate",
        "short_description": "Foliar tonic for resilient organic crops.",
        "description": "Fermented Urtica dioica concentrate with chelated iron and silica. Strengthens cell walls and deters aphids without chemical residue.",
        "image": "https://images.unsplash.com/photo-1685426797195-1ac5d8b5647a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxzaWtraW0lMjB0ZXJyYWNlZCUyMGZhcm1zJTIwaGltYWxheWFzfGVufDB8fHx8MTc3NzA5NTQwNnww&ixlib=rb-4.1.0&q=85",
        "stock": 35,
        "featured": False,
    },
    {
        "name": "Rhododendron Petal Tisane",
        "slug": "rhododendron-petal-tisane",
        "category": "wellness",
        "price": 460.0,
        "unit": "60 g tin",
        "short_description": "Single-bloom infusion from East Sikkim slopes.",
        "description": "Hand-plucked Rhododendron arboreum petals, sun-dried and tin-aged. Floral, faintly tannic – sip slowly.",
        "image": "https://images.unsplash.com/photo-1774979300998-971cc96cc121?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwYnJhbmQlMjBsb2dvfGVufDB8fHx8MTc3NzA5NTQxNnww&ixlib=rb-4.1.0&q=85",
        "stock": 25,
        "featured": True,
    },
    {
        "name": "FLORAX Apricot Oil – Pure Cold-Pressed Pahadi Gutti Ka Tel",
        "slug": "florax-apricot-oil",
        "category": "wellness",
        "price": 499.0,
        "unit": "100 ml",
        "short_description": "Cold-pressed pahadi apricot kernel oil. Single-origin, unrefined.",
        "description": "Pressed within 72 hours of harvest from sun-dried Himalayan apricot kernels (Gutti). Rich in oleic acid, vitamin E and natural antioxidants. Use as a face oil, hair sealant, or warm body massage oil. Cold-pressed, never deodorised.",
        "image": "https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 0,
        "featured": False,
    },
    {
        "name": "FLORAX Cow Ghee – Pure Pahadi Gaay ka Desi Ghee",
        "slug": "florax-cow-ghee",
        "category": "produce",
        "price": 1999.0,
        "unit": "1 L",
        "short_description": "Slow-churned bilona ghee from grass-fed Pahadi cows.",
        "description": "Hand-churned in small batches from cultured A2 curd of native Pahadi cows that graze open Himalayan pastures. Golden, aromatic, with that nutty 'pahadi' depth chemical ghee can never replicate. Wood-fired, glass-bottled.",
        "image": "https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 0,
        "featured": True,
    },
    {
        "name": "FLORAX Putka Honey",
        "slug": "florax-putka-honey",
        "category": "produce",
        "price": 2599.0,
        "unit": "500 g",
        "short_description": "Rare wild Putka honey from cliff-nesting Himalayan bees.",
        "description": "Foraged once a year from Apis dorsata laboriosa colonies in the upper Sikkim cliffs. Dark, mineral-rich, with rhododendron undertones and a faint psychotropic warmth in the throat — the legendary 'mad honey' of the eastern Himalaya. Limited harvest.",
        "image": "https://scontent.fccu16-1.fna.fbcdn.net/v/t39.30808-6/481779576_9154370537944811_2255668117514916602_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Amgp4Z3rbLkQ7kNvwHF0XCj&_nc_oc=Adr3hLPuM8MaRdbsZqYsA2J_DNVdvGYAp7VTTkIAIF0VkRnWgA_DysX7iZjlK1MLsF8&_nc_zt=23&_nc_ht=scontent.fccu16-1.fna&_nc_gid=Xeh0Bg7xEVNyJ1jSUrWBgA&_nc_ss=7b289&oh=00_Af_8Ncvabg8YnHNs63l4HCYHBhff7SNrUBeqT2c4QaYgZA&oe=6A219A96",
        "stock": 0,
        "featured": True,
    },
    {
        "name": "FLORAX Spring Flush Darjeeling Tea – Handcrafted from Makaibari",
        "slug": "florax-spring-flush-darjeeling",
        "category": "wellness",
        "price": 499.0,
        "unit": "20 g",
        "short_description": "First Flush 2024 from the legendary Makaibari estate.",
        "description": "Hand-plucked over four cold mornings in late March from the biodynamic terraces of Makaibari, Kurseong. Pale golden liquor, muscatel finish, the unmistakable 'champagne of teas' aroma. 20 g micro-tin, just enough for 10 perfect pots.",
        "image": "https://images.pexels.com/photos/904616/pexels-photo-904616.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 0,
        "featured": True,
    },
    {
        "name": "FLORAX Herbal Tea – A Soothing Himalayan Infusion",
        "slug": "florax-herbal-tea",
        "category": "wellness",
        "price": 399.0,
        "unit": "20 g",
        "short_description": "Tulsi, lemongrass, rhododendron petals, ginger.",
        "description": "A caffeine-free Himalayan infusion blending wild tulsi, Sikkim lemongrass, sun-dried rhododendron petals and slivered ginger. Calming for the evening, restorative after monsoon walks. Hand-blended in our Gangtok studio.",
        "image": "https://images.pexels.com/photos/1638772/pexels-photo-1638772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 0,
        "featured": False,
    },
    {
        "name": "FLORAX Mini Tea Box – Diwali Gift for Chai Lovers",
        "slug": "florax-mini-tea-box",
        "category": "wellness",
        "price": 1499.0,
        "unit": "Gift box · 4 tins",
        "short_description": "Four mini tins of our finest teas in a Diwali presentation case.",
        "description": "A festive gift case bringing together our First Flush Darjeeling, second-flush Makaibari, Tulsi-Rhododendron herbal blend, and Spiced Pahadi masala chai — each in a 15 g tin, wrapped in handmade Sikkim lokta paper. Includes a handwritten note from our brewmaster.",
        "image": "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 0,
        "featured": True,
    },
    {
        "name": "FLORAX Wellness & Warmth Box – Sip. Breathe. Slow Down.",
        "slug": "florax-wellness-warmth-box",
        "category": "wellness",
        "price": 1330.0,
        "unit": "Curated box",
        "short_description": "A ritual in a box — tea, honey, ghee, and a candle.",
        "description": "A complete winter-morning ritual: 20 g of our Herbal Himalayan infusion, a 100 g jar of buckwheat honey, a 50 ml miniature of pahadi cow ghee, plus a hand-poured beeswax candle scented with rhododendron. Sip. Breathe. Slow down.",
        "image": "https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stock": 0,
        "featured": False,
    },
]

SEED_BLOG = [
    {
        "title": "Why we ferment nettles at 1800 metres",
        "slug": "why-we-ferment-nettles",
        "excerpt": "The science of cold-climate fermentation and what it means for soil that has fed Sikkim for centuries.",
        "content": "At 1800 metres, fermentation slows down — and that's the gift. Cooler vats give our microbial communities time to fully chelate iron and silica from stinging nettle, creating a foliar tonic that no industrial process can shortcut.\n\nWe started this work in 2021 with three village partners in Dzongu. Today, twelve farms ferment with us through the monsoon, returning the same vats year after year. The biology compounds. The soil notices.\n\nThis is the rhythm FLORAX answers to: not seasons of growth, but seasons of patience.",
        "cover_image": "https://images.pexels.com/photos/8220089/pexels-photo-8220089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "tag": "Field Notes",
        "author": "Tashi Lhamo, Lead Agronomist",
    },
    {
        "title": "Sikkim's organic state mandate, ten years on",
        "slug": "sikkim-organic-state-ten-years",
        "excerpt": "A reflection on the world's first fully organic state and the gaps agri-biotech still needs to close.",
        "content": "In 2016 Sikkim was declared the world's first fully organic state. The headline was beautiful; the ground reality more nuanced.\n\nFLORAX exists in that nuance. Pure organic farming without modern soil biology is a slow climb. Modern agri-biotech without rooted ecological knowledge is an export. We try to live in the middle: indigenous microbes, modern characterisation, transparent supply.\n\nTen years in, the work is not done. But the soil remembers everything we do.",
        "cover_image": "https://images.unsplash.com/photo-1685426797195-1ac5d8b5647a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxzaWtraW0lMjB0ZXJyYWNlZCUyMGZhcm1zJTIwaGltYWxheWFzfGVufDB8fHx8MTc3NzA5NTQwNnww&ixlib=rb-4.1.0&q=85",
        "tag": "Perspective",
        "author": "Debayan Pramanik, Founder",
    },
    {
        "title": "Inside our Gangtok R&D lab",
        "slug": "inside-our-gangtok-lab",
        "excerpt": "How a small team uses HPLC, microbial assays and a lot of mountain weather to keep promises.",
        "content": "Our Gangtok facility is small by industry standards — six benches, two HPLCs, one good window. But every batch of cardamom, turmeric or compost activator passes through it.\n\nWe test for curcumin. We sequence microbial colonies. We log heavy metals. And then we publish the certificates beside the product, because trust is built one assay at a time.",
        "cover_image": "https://images.pexels.com/photos/8851404/pexels-photo-8851404.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "tag": "Lab Notes",
        "author": "Dr. Rinzing Bhutia, R&D Head",
    },
]


@app.on_event("startup")
async def startup_seed():
    # Seed admin
    admin = await db.admins.find_one({"email": ADMIN_EMAIL})
    if not admin:
        await db.admins.insert_one({
            "email": ADMIN_EMAIL,
            "password_hash": pwd_ctx.hash(ADMIN_PASSWORD),
            "created_at": now_utc_iso(),
        })
        logger.info(f"Seeded admin {ADMIN_EMAIL}")

    # Upsert products by slug — adds missing products and updates name/description/price for existing ones.
    inserted, updated = 0, 0
    for p in SEED_PRODUCTS:
        existing = await db.products.find_one({"slug": p["slug"]}, {"_id": 0, "id": 1})
        if existing:
            # Preserve original id and created_at; refresh editable fields.
            updates = {k: p[k] for k in ("name", "category", "price", "unit", "short_description", "description", "image", "featured")}
            await db.products.update_one({"slug": p["slug"]}, {"$set": updates})
            updated += 1
        else:
            await db.products.insert_one(Product(**p).model_dump())
            inserted += 1
    logger.info(f"Products seed: inserted={inserted}, updated={updated}")

    if await db.blog.count_documents({}) == 0:
        for b in SEED_BLOG:
            await db.blog.insert_one(BlogPost(**b).model_dump())
        logger.info("Seeded blog")


# Mount router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
