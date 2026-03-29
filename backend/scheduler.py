import itertools
from typing import List, Dict, Any, Optional

def get_status(days: int) -> str:
    """ Maps remaining days_to_live to urgency status. """
    if days <= 2:
        return "critical"
    elif days <= 5:
        return "warning"
    return "fresh"

def determine_meal_name(ingredients: List[str]) -> str:
    if not ingredients:
        return "Empty Plate"
    if len(ingredients) == 1:
        return f"Roasted {ingredients[0]}"
    if len(ingredients) == 2:
        return f"Sautéed {ingredients[0]} and {ingredients[1]}"
    main_items = ", ".join(ingredients[:-1])
    return f"Sautéed {main_items}, and {ingredients[-1]}"

def solve_0_waste_dag(inventory: List[Dict[str, Any]]) -> Optional[List[Dict[str, Any]]]:
    """
    State-space DAG search to find a 0% waste meal schedule.
    Treats meal prep as a constrained CPU scheduling problem.
    """
    memo = {}
    
    def dfs(day: int, remaining_indices: frozenset) -> Optional[List[Dict[str, Any]]]:
        if not remaining_indices:
            return []
            
        state = (day, remaining_indices)
        if state in memo:
            return memo[state]
            
        # CONSTRAINT 1: Deadlines. Any remaining item with TTL < day means we failed (wasted food).
        expired = [i for i in remaining_indices if inventory[i]['days_to_live'] < day]
        if expired:
            memo[state] = None
            return None
            
        # CONSTRAINT 2: Critical Path. Items expiring ON this day MUST be consumed today.
        must_cook = [i for i in remaining_indices if inventory[i]['days_to_live'] == day]
        if len(must_cook) > 3: # Hardware limit: 3 ingredients per meal / 1 meal per day
            memo[state] = None
            return None
            
        optional_items = [i for i in remaining_indices if inventory[i]['days_to_live'] > day]
        max_additional = 3 - len(must_cook)
        
        meal_options = []
        for k in range(max_additional + 1):
            for combo in itertools.combinations(optional_items, k):
                meal = must_cook + list(combo)
                if meal: # Cannot schedule an empty meal if there is food left
                    meal_options.append(meal)
                    
        # Heuristic optimization: explore nodes (meals) that consume the lowest TTL items first
        meal_options.sort(key=lambda m: sum(inventory[i]['days_to_live'] for i in m))
        
        for meal in meal_options:
            next_remaining = remaining_indices.difference(meal)
            result = dfs(day + 1, next_remaining)
            
            if result is not None: # Valid path found!
                path = [{"day": day, "consumed_indices": meal}] + result
                memo[state] = path
                return path
                
        memo[state] = None
        return None

    # Begin DFS from Day 1
    initial_indices = frozenset(range(len(inventory)))
    return dfs(1, initial_indices)

def generate_schedule(inventory: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Executes the DAG solver and formats the output for the UI.
    """
    if not inventory:
        return {"inventory": [], "critical_path": []}

    # Format the inventory list for Recharts UI
    enriched_inventory = []
    for item in sorted(inventory, key=lambda x: x["days_to_live"]):
        enriched_item = dict(item)
        enriched_item["status"] = get_status(item["days_to_live"])
        enriched_inventory.append(enriched_item)
        
    # Execute the optimal scheduling algorithm
    solution = solve_0_waste_dag(inventory)
    
    critical_path = []
    if solution is not None:
        for node in solution:
            consumed_names = [inventory[i]["name"] for i in node["consumed_indices"]]
            
            # Generate deterministic pseudo-random recipe data based on ingredient list
            seed_hash = sum(len(n) for n in consumed_names) + node["day"]
            mock_prep_time = 15 + (seed_hash % 30) # 15 to 45 mins
            mock_cals = 350 + (seed_hash * 15 % 500)
            
            mock_instruction_string = (
                f"Chef's Recommended Prep:\n"
                f"1. Prep your cooking station and preheat to 375°F.\n"
                f"2. Prepare and combine {' and '.join(consumed_names)} in your main pan.\n"
                f"3. Cook for {mock_prep_time} minutes until perfectly tender and enjoy your waste-free meal!"
            )

            critical_path.append({
                "day": node["day"],
                "meal_name": determine_meal_name(consumed_names),
                "consumed_ingredients": consumed_names,
                "prep_time": mock_prep_time,
                "calories": mock_cals,
                "description": mock_instruction_string
            })
    # If solution is None, critical_path remains empty, which the UI interprets as UNSCHEDULABLE / NO PATH.

    return {
        "inventory": enriched_inventory,
        "critical_path": critical_path
    }
