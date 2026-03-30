import uuid
import random

wards = list(range(1, 46))
locations = ["Main Street", "Seikkantha Street", "Pyay Road", "Kaba Aye Pagoda Road", "Merchant Street", "Mahabandoola Road", "Strand Road"]
types = ["Apartment", "Condo", "House", "Land", "Shop"]
statuses = ["For Sale", "For Rent"]
listing_statuses = ["Active", "Sold", "Rented"]
remarks = ["Good location", "Negiotiable", "Urgent Sale", "Investment property", "Well maintained"]

sql_statements = []

for i in range(1, 101):
    id = str(uuid.uuid4())
    title = f"{random.choice(types)} in {random.choice(locations)} - {random.choice(wards)}"
    price = random.randint(50, 5000)
    ward = random.choice(wards)
    location = f"No. {random.randint(1, 500)}, {random.choice(locations)}"
    type_ = random.choice(types)
    status = random.choice(statuses)
    listing_status = "Active" if i <= 80 else random.choice(listing_statuses)
    bedrooms = random.randint(1, 5) if type_ != "Land" else 0
    bathrooms = random.randint(1, 3) if type_ != "Land" else 0
    area = random.randint(400, 5000)
    phone = f"09{random.randint(100000000, 999999999)}"
    commission = 2.0
    remark = random.choice(remarks)
    
    sql = f"INSERT INTO properties (id, title, price, ward, location, type, status, listing_status, bedrooms, bathrooms, area, phone, commission_percent, internal_remarks) VALUES ('{id}', '{title}', {price}, {ward}, '{location}', '{type_}', '{status}', '{listing_status}', {bedrooms}, {bathrooms}, {area}, '{phone}', {commission}, '{remark}');"
    sql_statements.append(sql)

with open('seed_properties.sql', 'w') as f:
    f.write("\n".join(sql_statements))
