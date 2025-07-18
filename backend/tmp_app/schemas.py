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

class MessageSchema(Schema):

    detail: str


class LoginSchema(Schema):

    email: str
    password: str


class RegisterSchema(Schema):

    email: str
    password: str


class CurrentUser(Schema):
    id: int | None
    username: str | None
    email: str | None = None
    is_active: bool
    is_authenticated: bool
    is_superuser: bool

    class Config:
        from_attributes = True

class ShapeParams(Schema):
    live: str | None = None
    table: str = 'tasks'  
    handle: str | None = None
    offset: str | None = None
    cursor: str | None = None
    columns: str | None = None  
    where: str | None = None 