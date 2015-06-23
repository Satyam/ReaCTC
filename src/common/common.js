export const ANCHO_CELDA = 100,
	CENTRO_CELDA = ANCHO_CELDA / 2,
	X = {
		N: CENTRO_CELDA,
		NE: ANCHO_CELDA,
		E: ANCHO_CELDA,
		SE: ANCHO_CELDA,
		S: CENTRO_CELDA,
		SW: 0,
		W: 0,
		NW: 0
	},
	Y = {
		N: 0,
		NE: 0,
		E: CENTRO_CELDA,
		SE: ANCHO_CELDA,
		S: ANCHO_CELDA,
		SW: ANCHO_CELDA,
		W: CENTRO_CELDA,
		NW: 0
	},
	ANG = {
		N: 270,
		NE: 315,
		E: 0,
		SE: 45,
		S: 90,
		SW: 135,
		W: 180,
		NW: 225
	},
	DIR = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function splitCoords (coords) {
	var parts = coords.split(',');
	return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
}

export function leftButton (ev) {
	if (ev.button !== 0) return false;
	if (ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey) return false;
	ev.preventDefault();
	ev.stopPropagation();
	return true;
}
