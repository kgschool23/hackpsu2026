from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

# Import the greedy EDF algorithm
from scheduler import generate_schedule

app = FastAPI(title="Expiration Critical Path Engine")

# 1. SETUP: Enable CORS for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. DATA MODELS: Pydantic schemas validating API IO
class Ingredient(BaseModel):
    id: Optional[str] = None
    name: str
    days_to_live: int

class InventoryRequest(BaseModel):
    ingredients: List[Ingredient]

class ScheduledMeal(BaseModel):
    day: int
    meal_name: str
    consumed_ingredients: List[str]
    prep_time: int = 15
    calories: int = 500
    description: str = "A meticulously generated AI recipe designed for 0% waste."

class InventoryItemResponse(Ingredient):
    status: str

class ScheduleResponse(BaseModel):
    inventory: List[InventoryItemResponse]
    critical_path: List[ScheduledMeal]

# -- IN-MEMORY DATA STORE --
# Seed with some initial data matching the visual mock
mock_db = [
    {"id": "inv-001", "name": "Chicken Breast", "days_to_live": 2},
    {"id": "inv-002", "name": "Ground Beef", "days_to_live": 3},
    {"id": "inv-003", "name": "Spinach", "days_to_live": 4},
    {"id": "inv-004", "name": "Bell Peppers", "days_to_live": 5},
    {"id": "inv-005", "name": "Milk (1 gal)", "days_to_live": 6},
    {"id": "inv-010", "name": "Tomatoes", "days_to_live": 3},
    {"id": "inv-011", "name": "Avocados", "days_to_live": 2},
]

# 4. ENDPOINTS
@app.get("/api/schedule", response_model=ScheduleResponse)
async def get_schedule():
    """
    Returns the current inventory and the calculated critical path
    using the Earliest Deadline First algorithm.
    """
    result = generate_schedule(mock_db)
    return result

@app.post("/api/inventory", response_model=ScheduleResponse)
async def add_inventory(item: Ingredient):
    """
    Adds a new item to the in-memory array and returns the recalculated schedule.
    """
    new_item = item.dict()
    if not new_item.get("id"):
        new_item["id"] = f"inv-{uuid.uuid4().hex[:6]}"
        
    mock_db.append(new_item)
    
    # Recalculate and return new critical path
    result = generate_schedule(mock_db)
    return result

@app.delete("/api/inventory/{item_id}", response_model=ScheduleResponse)
async def delete_inventory(item_id: str):
    """
    Removes an item from the in-memory array by ID and returns the recalculated schedule.
    """
    global mock_db
    mock_db = [item for item in mock_db if item["id"] != item_id]
    
    # Recalculate and return new critical path
    return generate_schedule(mock_db)

@app.delete("/api/inventory", response_model=ScheduleResponse)
async def reset_inventory():
    """
    Clears the entire inventory.
    """
    global mock_db
    mock_db = []
    return generate_schedule(mock_db)

@app.post("/api/inventory/seed", response_model=ScheduleResponse)
async def seed_inventory():
    """
    Simulates a grocery run and populates the DAG with 12 structural constraints instantly.
    """
    global mock_db
    mock_db = [
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Chicken Breast", "days_to_live": 2},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Ground Beef", "days_to_live": 3},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Spinach", "days_to_live": 4},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Bell Peppers", "days_to_live": 5},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Milk (1 gal)", "days_to_live": 6},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Tomatoes", "days_to_live": 3},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Avocados", "days_to_live": 2},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Fresh Pasta", "days_to_live": 4},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Parmesan", "days_to_live": 14},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Butter", "days_to_live": 30},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Eggs", "days_to_live": 12},
        {"id": f"inv-{uuid.uuid4().hex[:6]}", "name": "Bacon", "days_to_live": 5},
    ]
    return generate_schedule(mock_db)

# You would run this locally with: uvicorn main:app --reload
