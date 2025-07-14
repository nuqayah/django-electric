from ninja import Schema
from datetime import datetime

class TaskSchemaIn(Schema):
    title: str
    description: str = None
    is_done: bool = False

class TaskSchemaOut(Schema):
    id: int
    title: str
    description: str
    is_done: bool
    created_at: datetime
    updated_at: datetime