"""
Background scheduler for periodic tasks.
Uses APScheduler to run cron jobs for keeping services alive.
"""
import httpx
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.config.settings import settings


scheduler = AsyncIOScheduler()


async def ping_services():
    """
    Ping backend and frontend services to keep them alive.
    Prevents free-tier hosting services from sleeping.
    """
    print(f"[Cron] Pinging services...")
    
    # Ping backend (self)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"http://{settings.HOST}:{settings.PORT}/health")
            print(f"[Cron] Server ping successful. Status: {response.status_code}")
    except Exception as e:
        print(f"[Cron] Error pinging server: {str(e)}")
    
    # Ping frontend
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(settings.CLIENT_PROD_URL)
            print(f"[Cron] Client ping successful. Status: {response.status_code}")
    except Exception as e:
        print(f"[Cron] Error pinging client: {str(e)}")


def setup_scheduler():
    """
    Set up scheduled jobs.
    Runs every 10 minutes to keep services alive.
    """
    print("🕐 Setting up scheduled jobs...")
    
    # Schedule ping job every 10 minutes
    scheduler.add_job(
        ping_services,
        trigger=CronTrigger(minute="*/10"),
        id="ping_services",
        name="Ping backend and frontend services",
        replace_existing=True
    )
    
    scheduler.start()
    print("✅ Scheduler started - services will be pinged every 10 minutes")


def shutdown_scheduler():
    """Shutdown the scheduler."""
    if scheduler.running:
        scheduler.shutdown()
        print("🛑 Scheduler shut down")
