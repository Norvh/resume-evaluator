from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from auth_utils import create_access_token, get_current_user, hash_password, verify_password
from database import get_session
from models import User
from schemas import LoginRequest, RegisterRequest, TokenResponse, UserResponse

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(request: RegisterRequest, session: Session = Depends(get_session)):
    existing_user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        email=request.email,
        hashed_password=hash_password(request.password),
        role="user",
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return UserResponse(email=user.email, role=user.role)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user.email)

    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user_email: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user = session.exec(
        select(User).where(User.email == current_user_email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return UserResponse(email=user.email, role=user.role)