"""Utilities to load location/station JSON into `Station` models.

This module provides functions to load station data from JSON files:
- `load_locations(path)` - loads simple location.json format
- `load_estaciones_completas(path)` - loads datos-completos.json format
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Union

from models.estacion_completa import EstacionCompleta


def load_locations(path: Union[str, Path]) -> Dict[str, Dict[str, Any]]:
    """Load JSON from `path` and return a list of dictionaries representing stations.

    Each entry is validated/normalized via `Station.parse_obj(...)` and then
    converted to a plain `dict` using `Station.to_dict()` so the caller receives
    serializable Python dicts rather than pydantic objects.

    Parameters
    - path: path to the JSON file containing station/location data.

    Returns
    - list of dict

    Raises
    - FileNotFoundError if the file doesn't exist
    - ValueError if the JSON structure is not recognized
    - pydantic.ValidationError if an entry cannot be parsed into Station
    """
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"JSON file not found: {p}")

    with p.open("r", encoding="utf-8") as fh:
        data = json.load(fh)

    return data


def load_estaciones_completas(path: Union[str, Path]) -> List[EstacionCompleta]:
    """Load datos-completos.json and return a dict mapping station names to EstacionCompleta.

    Parameters
    - path: path to the JSON file (typically datos-completos.json)

    Returns
    - dict mapping station name (str) -> EstacionCompleta instance

    Raises
    - FileNotFoundError if the file doesn't exist
    - pydantic.ValidationError if an entry cannot be parsed
    """
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"JSON file not found: {p}")

    with p.open("r", encoding="utf-8") as fh:
        data = json.load(fh)

    # data is a dict: {"acatitla": {...}, "santa_marta": {...}, ...}
    estaciones: List[EstacionCompleta] = []
    for nombre, info in data.items():
        estaciones.append(EstacionCompleta.from_dict(info, nombre))

    return estaciones
