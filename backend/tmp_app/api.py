from ninja import NinjaAPI
from typing import List
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, get_user_model, login, logout
from .models import Task
from .schemas import CurrentUser, LoginSchema, MessageSchema, RegisterSchema, ShapeParams, TaskSchemaIn, TaskSchemaOut
from ninja.security import HttpBearer
from ninja.errors import HttpError
import httpx
from django.http import StreamingHttpResponse
from django.conf import settings

api = NinjaAPI()

User = get_user_model()

class IsAuthenticated(HttpBearer):
    def authenticate(self, request, token: str):
        if request.user.is_authenticated:
            return request.user 
        return None

auth = IsAuthenticated()

# WIP
@api.post("/shapes/tasks")
def get_tasks_shape(request, params: ShapeParams):
    electric_shape_url = f"{settings.ELECTRIC_URL}/v1/shape"

    electric_params = params.dict(exclude_none=True)

    try:
        with httpx.stream("GET", electric_shape_url, params=electric_params, timeout=30.0) as response:
            response.raise_for_status()

            def stream_generator():
                yield from response.iter_bytes()

            django_response = StreamingHttpResponse(
                stream_generator(),
                content_type=response.headers.get('content-type'),
                status=response.status_code,
            )
            for header, value in response.headers.items():
                if header.lower().startswith('electric-') or header.lower() == 'cache-control':
                    django_response[header] = value

            return django_response                                                                                                                                                                                                          

    except httpx.HTTPStatusError as e:

        print(f"Error from Electric service")
        raise HttpError(e.response.status_code, f"Electric server error")

    except httpx.RequestError as e:
        raise HttpError(500, f"Failed to connect to Electric server: {e}")

    except httpx.TimeoutException:
        raise HttpError(504, "Electric server timeout")
    

@api.post('/auth/register', response={200: MessageSchema, 400: MessageSchema})
def register_user(request, data: RegisterSchema):
    if User.objects.filter(email=data.email).exists():
        return 400, {'detail': 'email already taken'}

    user = User.objects.create_user(email=data.email, password=data.password)

    return {'detail': f'{user} registered successfully'}


@api.post('/auth/login', response={200: MessageSchema, 401: MessageSchema})
def login_user(request, data: LoginSchema):
    user = authenticate(request, email=data.email, password=data.password)

    if user is not None:
        login(request, user)
        return {'detail': 'Login successful'}

    return 401, {'detail': 'Invalid credentials'}
    
@api.post('/auth/logout', response={200: MessageSchema})
def logout_user(request):
    logout(request)
    return {'detail': 'Logout successful'}


@api.get('/auth/me', response=CurrentUser)
def get_current_user(request):
    return request.user



@api.post("/tasks", response=TaskSchemaOut)
def create_task(request, data: TaskSchemaIn):

    task = Task.objects.create(user=request.user, **data.dict())
    return task

@api.get("/tasks", response=List[TaskSchemaOut])
def list_tasks(request):

    tasks = Task.objects.filter(user=request.user)
    return tasks

@api.get("/tasks/{task_id}", response=TaskSchemaOut, auth=auth)
def get_task(request, task_id: int):

    task = get_object_or_404(Task, id=task_id, user=request.user)
    return task

@api.put("/tasks/{task_id}", response=TaskSchemaOut, auth=auth)
def update_task(request, task_id: int, payload: TaskSchemaIn):

    task = get_object_or_404(Task, id=task_id, user=request.user)
    for attr, value in payload.dict().items():
        setattr(task, attr, value)
    task.save()
    return task

@api.delete("/tasks/{task_id}", response={204: None}, auth=auth)
def delete_task(request, task_id: int):

    task = get_object_or_404(Task, id=task_id, user=request.user)
    task.delete()
    return 204