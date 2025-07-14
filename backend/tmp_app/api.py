from ninja import NinjaAPI
from typing import List
from django.shortcuts import get_object_or_404
from .models import Task
from .schemas import TaskSchemaIn, TaskSchemaOut

api = NinjaAPI()


@api.post("/tasks", response=TaskSchemaOut)
def create_task(request, payload: TaskSchemaIn):

    task = Task.objects.create(**payload.dict())
    return task

@api.get("/tasks", response=List[TaskSchemaOut])
def list_tasks(request):

    tasks = Task.objects.all()
    return tasks

@api.get("/tasks/{task_id}", response=TaskSchemaOut)
def get_task(request, task_id: int):

    task = get_object_or_404(Task, id=task_id)
    return task

@api.put("/tasks/{task_id}", response=TaskSchemaOut)
def update_task(request, task_id: int, payload: TaskSchemaIn):

    task = get_object_or_404(Task, id=task_id)
    for attr, value in payload.dict().items():
        setattr(task, attr, value)
    task.save()
    return task

@api.delete("/tasks/{task_id}", response={204: None})
def delete_task(request, task_id: int):

    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return 204