from typing import List, Dict, Any

def get_status(days: int) -> str:
    """
    Maps days_to_live to urgency status.
    """
    if days <= 2:
        return "critical"
    elif days <= 5:
        return "warning"
    return "fresh"

def determine_meal_name(ingredients: List[str]) -> str:
    """
    Dynamically generates a meal name based on the grouped items.
    """
    if not ingredients:
        return "Empty Plate"
    if len(ingredients) == 1:
        return f"Roasted {ingredients[0]}"
    if len(ingredients) == 2:
        return f"Sautéed {ingredients[0]} and {ingredients[1]}"
    
    # Generic for 3 or more items
    main_items = ", ".join(ingredients[:-1])
    return f"Sautéed {main_items}, and {ingredients[-1]}"

def generate_schedule(inventory: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Earliest Deadline First (EDF) greedy algorithm.
    Takes the current inventory, sorts by deadlines (days_to_live), and groups 
    them into logical 'Meals' sequentially.
    """
    if not inventory:
        return {"inventory": [], "critical_path": []}

    # Algorithm Step 1: Sort by days_to_live (earliest deadline first)
    sorted_inventory = sorted(inventory, key=lambda x: x["days_to_live"])
    
    # Algorithm Step 2: Enrich inventory with computed UI status
    enriched_inventory = []
    for item in sorted_inventory:
        enriched_item = dict(item)
        enriched_item["status"] = get_status(item["days_to_live"])
        enriched_inventory.append(enriched_item)
        
    critical_path = []
    
    # Algorithm Step 3: Greedy Grouping
    # For a hackathon, we pack up to 3 expiring ingredients per meal (1 meal / day assumed)
    max_ingredients_per_meal = 3
    
    # Tracking the simulated time (Days)
    day = 1
    i = 0
    
    while i < len(enriched_inventory):
        # Extract the next logical group of ingredients
        chunk = enriched_inventory[i:i + max_ingredients_per_meal]
        
        consumed_names = [item["name"] for item in chunk]
        meal_name = determine_meal_name(consumed_names)
        
        # Note: If an item has days_to_live == 1, since the array is sorted,
        # it naturally gets pulled into day 1's chunk, fulfilling the system requirement.
        
        critical_path.append({
            "day": day,
            "meal_name": meal_name,
            "consumed_ingredients": consumed_names
        })
        
        day += 1
        i += max_ingredients_per_meal
        
    return {
        "inventory": enriched_inventory,
        "critical_path": critical_path
    }
