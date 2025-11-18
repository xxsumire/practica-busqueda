"""Sistema de búsqueda de rutas en el Metro usando A*.

Este script carga los datos completos de las estaciones del metro y proporciona
funcionalidad para buscar rutas óptimas entre estaciones.
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
SRC_DIR = ROOT_DIR / "src"
sys.path.append(str(SRC_DIR))

from pathlib import Path
from helpers.load_locations import load_estaciones_completas


def main():
    """Función principal que carga las estaciones y muestra información básica."""
    # Ruta al archivo de datos completos
    datos_path = Path(__file__).parent / "data" / "datos-completos.json"
    
    # Cargar todas las estaciones
    print("Cargando estaciones del metro...")
    estaciones = load_estaciones_completas(datos_path)
    
    print(f"\n✓ Cargadas {len(estaciones)} estaciones")
    
    # Mostrar algunas estaciones de ejemplo
    print("\nEjemplos de estaciones cargadas:")
    for i, estacion in enumerate(estaciones[:5]):
        print(f"\n{i+1}. {estacion.name.upper()}")
        print(f"   Líneas: {', '.join([l.value for l in estacion.lineas])}")
        print(f"   Conexiones: {len(estacion.conexiones)}")
        if estacion.conexiones:
            conn = estacion.conexiones[0]
            print(f"   → {conn.estacion} ({conn.distancia} km)")
    
    return estaciones


if __name__ == "__main__":
    try:
        estaciones = main()
        print("\n✓ Sistema inicializado correctamente")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
