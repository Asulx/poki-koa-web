/**
 * @file calculos.test.ts
 * @description Pruebas unitarias de los cálculos de presentación y de la
 * evaluación de rangos de signos vitales.
 */

import { describe, expect, it } from 'vitest';

import {
  contarPor,
  formatearEdadMeses,
  inicialesDe,
  porcentaje,
  signoEnRango,
  truncar,
} from './calculos';

describe('inicialesDe', () => {
  it('toma la primera y la última palabra de un nombre completo', () => {
    expect(inicialesDe('María Fernanda López')).toBe('ML');
  });

  it('usa las dos primeras letras cuando solo hay una palabra', () => {
    expect(inicialesDe('Ana')).toBe('AN');
  });

  it('devuelve un marcador cuando el nombre está vacío', () => {
    expect(inicialesDe('   ')).toBe('?');
  });
});

describe('formatearEdadMeses', () => {
  it('describe como recién nacido a quien tiene menos de un mes', () => {
    expect(formatearEdadMeses(0)).toBe('Recién nacido');
    expect(formatearEdadMeses(-1)).toBe('Recién nacido');
  });

  it('concuerda en singular y plural', () => {
    expect(formatearEdadMeses(1)).toBe('1 mes');
    expect(formatearEdadMeses(7)).toBe('7 meses');
  });
});

describe('porcentaje', () => {
  it('redondea la proporción entre parte y total', () => {
    expect(porcentaje(1, 3)).toBe(33);
  });

  it('acota el resultado al rango 0–100', () => {
    expect(porcentaje(5, 2)).toBe(100);
    expect(porcentaje(-5, 10)).toBe(0);
  });

  it('devuelve 0 cuando el total no es positivo', () => {
    expect(porcentaje(3, 0)).toBe(0);
  });
});

describe('contarPor', () => {
  it('agrupa los elementos por la clave indicada', () => {
    const datos = [
      { estado: 'activo' },
      { estado: 'activo' },
      { estado: 'alta' },
    ];
    expect(contarPor(datos, (item) => item.estado)).toEqual({
      activo: 2,
      alta: 1,
    });
  });

  it('devuelve un objeto vacío con una colección vacía', () => {
    expect(contarPor([], () => 'x')).toEqual({});
  });
});

describe('truncar', () => {
  it('deja intacto el texto que cabe en el máximo', () => {
    expect(truncar('Poki Koa', 20)).toBe('Poki Koa');
  });

  it('recorta y agrega puntos suspensivos cuando excede el máximo', () => {
    const resultado = truncar('Monitoreo neonatal intensivo', 12);
    expect(resultado).toHaveLength(12);
    expect(resultado.endsWith('…')).toBe(true);
  });
});

describe('signoEnRango', () => {
  it('acepta valores dentro del rango clínico', () => {
    expect(signoEnRango('ritmoCardiaco', 120)).toBe(true);
    expect(signoEnRango('spo2', 98)).toBe(true);
    expect(signoEnRango('temperatura', 36.8)).toBe(true);
  });

  it('rechaza valores fuera del rango clínico', () => {
    expect(signoEnRango('ritmoCardiaco', 190)).toBe(false);
    expect(signoEnRango('spo2', 85)).toBe(false);
    expect(signoEnRango('temperatura', 38.4)).toBe(false);
  });

  it('considera en rango una lectura ausente', () => {
    expect(signoEnRango('spo2', null)).toBe(true);
    expect(signoEnRango('temperatura', undefined)).toBe(true);
  });
});
