from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
from app.core.logging import logger

# SQLite specific connect args
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    logger.info("Initializing database tables...")
    # Import all models before create_all
    import app.models.user  # noqa: F401
    import app.models.scan  # noqa: F401
    Base.metadata.create_all(bind=engine)

    # Safe auto-migration for SQLite to add new columns if table already existed
    try:
        from sqlalchemy import text
        with engine.begin() as conn:
            result = conn.execute(text("PRAGMA table_info(scans)")).fetchall()
            col_names = [row[1] for row in result]
            if col_names and "user_id" not in col_names:
                conn.execute(text("ALTER TABLE scans ADD COLUMN user_id VARCHAR(36)"))
                logger.info("Auto-migrated scans table: added user_id column.")
    except Exception as e:
        logger.warning(f"SQLite migration check notice: {e}")

    logger.info("Database tables initialized successfully.")

# Ensure tables are created upon initialization
init_db()

