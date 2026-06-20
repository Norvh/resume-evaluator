from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from auth_utils import require_admin
from database import get_session
from models import User
from schemas import AdminUpdateRole, UserResponse

router = APIRouter()


@router.get("/users", response_model=list[UserResponse])
def list_users(
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    users = session.exec(select(User)).all()
    return users


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user_role(
    user_id: int,
    request: AdminUpdateRole,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.role = request.role
    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    session.delete(user)
    session.commit()

    return {"message": "User deleted"}