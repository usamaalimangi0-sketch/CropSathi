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
    import app.models.payment  # noqa: F401
    import app.models.lead  # noqa: F401
    Base.metadata.create_all(bind=engine)

    # Safe auto-migration for SQLite to add new monetization columns if tables already existed
    try:
        from sqlalchemy import text
        with engine.begin() as conn:
            # 1. Check scans table
            res_scans = conn.execute(text("PRAGMA table_info(scans)")).fetchall()
            scan_cols = [row[1] for row in res_scans]
            if scan_cols and "user_id" not in scan_cols:
                conn.execute(text("ALTER TABLE scans ADD COLUMN user_id VARCHAR(36)"))
                logger.info("Auto-migrated scans table: added user_id column.")

            # 2. Check users table for monetization fields
            res_users = conn.execute(text("PRAGMA table_info(users)")).fetchall()
            user_cols = [row[1] for row in res_users]
            if user_cols:
                if "subscription_tier" not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(50) DEFAULT 'free'"))
                if "scans_used_this_month" not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN scans_used_this_month INTEGER DEFAULT 0"))
                if "monthly_scan_limit" not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN monthly_scan_limit INTEGER DEFAULT 3"))
                if "subscription_expires_at" not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN subscription_expires_at DATETIME"))
                logger.info("Auto-migrated users table: verified monetization columns.")
    except Exception as e:
        logger.warning(f"SQLite migration check notice: {e}")

    logger.info("Database tables initialized successfully.")

# Ensure tables are created upon initialization
init_db()
