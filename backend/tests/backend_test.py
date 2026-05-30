"""FLORAX backend API regression tests."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://florax-sikkim.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@florax.in"
ADMIN_PASSWORD = "Florax@Sikkim2025"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def token(s):
    r = s.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Health ----------
def test_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ---------- Products ----------
def test_list_products(s):
    r = s.get(f"{API}/products")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    cats = {p["category"] for p in data}
    assert {"produce", "herbs", "biotech-inputs", "wellness"}.issubset(cats)
    for p in data:
        assert "_id" not in p
        assert "id" in p and "slug" in p


def test_filter_products_by_category(s):
    for cat in ["produce", "herbs", "biotech-inputs", "wellness"]:
        r = s.get(f"{API}/products", params={"category": cat})
        assert r.status_code == 200
        for p in r.json():
            assert p["category"] == cat


def test_get_product_by_slug(s):
    r = s.get(f"{API}/products/sikkim-large-cardamom")
    assert r.status_code == 200
    p = r.json()
    assert p["slug"] == "sikkim-large-cardamom"
    assert "_id" not in p


def test_get_product_404(s):
    r = s.get(f"{API}/products/does-not-exist-xyz")
    assert r.status_code == 404


# ---------- Blog ----------
def test_list_blog(s):
    r = s.get(f"{API}/blog")
    assert r.status_code == 200
    posts = r.json()
    assert len(posts) >= 3
    for b in posts:
        assert "_id" not in b


def test_get_blog_by_slug(s):
    r = s.get(f"{API}/blog/why-we-ferment-nettles")
    assert r.status_code == 200
    assert r.json()["slug"] == "why-we-ferment-nettles"


# ---------- Inquiries ----------
def test_create_inquiry_no_500_on_resend(s):
    payload = {
        "name": "TEST_User",
        "email": "test_user@example.com",
        "phone": "+919999999999",
        "subject": "TEST inquiry",
        "message": "Hello from pytest",
    }
    r = s.post(f"{API}/inquiries", json=payload)
    assert r.status_code == 200, r.text  # FastAPI default success
    data = r.json()
    assert data["email"] == payload["email"]
    assert "id" in data
    assert "_id" not in data


# ---------- Partners ----------
def test_create_partner(s):
    payload = {
        "full_name": "TEST Farmer",
        "email": "test_farmer@example.com",
        "phone": "+919888888888",
        "village": "Dzongu",
        "district": "North Sikkim",
        "farm_size_acres": 2.5,
        "crops": "Cardamom, Turmeric",
        "notes": "TEST",
    }
    r = s.post(f"{API}/partners", json=payload)
    assert r.status_code == 200, r.text
    assert r.json()["email"] == payload["email"]


# ---------- Orders ----------
def test_create_order_with_shipping(s):
    items = [{
        "product_id": str(uuid.uuid4()),
        "name": "Test Product",
        "price": 200.0,
        "quantity": 2,
        "image": "https://example.com/x.jpg",
    }]
    payload = {
        "customer_name": "TEST Buyer",
        "customer_email": "test_buyer@example.com",
        "customer_phone": "+919777777777",
        "address_line1": "1 Test St",
        "city": "Gangtok",
        "state": "Sikkim",
        "pincode": "737101",
        "items": items,
        "notes": "TEST",
    }
    r = s.post(f"{API}/orders", json=payload)
    assert r.status_code == 200, r.text
    o = r.json()
    assert o["subtotal"] == 400.0
    assert o["shipping"] == 80.0  # below 1500
    assert o["total"] == 480.0
    assert o["status"] == "placed"


def test_create_order_free_shipping(s):
    items = [{
        "product_id": str(uuid.uuid4()),
        "name": "Big",
        "price": 800.0,
        "quantity": 2,
        "image": "https://example.com/x.jpg",
    }]
    payload = {
        "customer_name": "TEST Buyer2",
        "customer_email": "tb2@example.com",
        "customer_phone": "+919777777778",
        "address_line1": "2 Test",
        "city": "Gangtok", "state": "Sikkim", "pincode": "737101",
        "items": items,
    }
    r = s.post(f"{API}/orders", json=payload)
    assert r.status_code == 200
    assert r.json()["shipping"] == 0.0


# ---------- Admin auth ----------
def test_admin_login_success(token):
    assert isinstance(token, str) and len(token) > 20


def test_admin_login_bad(s):
    r = s.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_protected_requires_auth(s):
    assert s.get(f"{API}/admin/stats").status_code == 401
    assert s.get(f"{API}/inquiries").status_code == 401
    assert s.get(f"{API}/partners").status_code == 401
    assert s.get(f"{API}/orders").status_code == 401
    assert s.post(f"{API}/products", json={}).status_code == 401


def test_admin_stats(s, auth_headers):
    r = s.get(f"{API}/admin/stats", headers=auth_headers)
    assert r.status_code == 200
    d = r.json()
    for k in ["products", "blog", "inquiries", "partners", "orders"]:
        assert k in d


def test_admin_create_and_delete_product(s, auth_headers):
    slug = f"test-prod-{uuid.uuid4().hex[:8]}"
    payload = {
        "name": "TEST Product",
        "slug": slug,
        "category": "wellness",
        "price": 99.0,
        "unit": "pack",
        "short_description": "TEST short",
        "description": "TEST long",
        "image": "https://example.com/i.jpg",
        "stock": 5,
        "featured": False,
    }
    r = s.post(f"{API}/products", json=payload, headers=auth_headers)
    assert r.status_code == 200, r.text
    pid = r.json()["id"]
    g = s.get(f"{API}/products/{slug}")
    assert g.status_code == 200
    d = s.delete(f"{API}/products/{pid}", headers=auth_headers)
    assert d.status_code == 200
    assert d.json()["deleted"] == 1


def test_admin_create_blog(s, auth_headers):
    slug = f"test-post-{uuid.uuid4().hex[:8]}"
    r = s.post(f"{API}/blog", json={
        "title": "TEST Post", "slug": slug, "excerpt": "x",
        "content": "y", "cover_image": "https://example.com/i.jpg",
    }, headers=auth_headers)
    assert r.status_code == 200, r.text
    assert r.json()["slug"] == slug


def test_admin_patch_inquiry_status(s, auth_headers):
    inq = s.get(f"{API}/inquiries", headers=auth_headers).json()
    if not inq:
        pytest.skip("no inquiries")
    iid = inq[0]["id"]
    r = s.patch(f"{API}/inquiries/{iid}", json={"status": "resolved"}, headers=auth_headers)
    assert r.status_code == 200
