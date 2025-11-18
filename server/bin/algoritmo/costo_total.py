
def costo_total(g_n: float, h_n: float) -> float:
    """Calcula el costo total f(n) = g(n) + h(n).
    
    Args:
        g_n: Costo real acumulado desde el inicio (segundos)
        h_n: Heurística estimada hasta el objetivo (segundos)
    
    Returns:
        Costo total f(n) en segundos
    
    Example:
        >>> g = 120.5  # 2 minutos de viaje real
        >>> h = 180.0  # 3 minutos estimados restantes
        >>> f = costo_total(g, h)
        >>> print(f"Costo total estimado: {f:.2f} segundos ({f/60:.2f} minutos)")
    """
    return g_n + h_n
