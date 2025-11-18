from pathlib import Path

class Config:
    BASE_DIR = Path(__file__).parent.parent
    DATA_DIR = BASE_DIR / "bin" / "data"
    
    DATOS_COMPLETOS = DATA_DIR / "datos-completos.json"