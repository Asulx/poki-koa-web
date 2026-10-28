import { describe, it, expect } from 'vitest';
import { evaluarAlerta } from './alertasService';

/**
 * @file alertasService.test.ts
 * @description Suite de pruebas unitarias para el módulo crítico de evaluación de alertas del sistema de monitoreo neonatal.
 * Verifica la correcta clasificación de niveles normales, advertencias, alertas críticas, casos límite y manejo defensivo de errores.
 */
describe('Módulo Crítico: Sistema de Alertas', () => {
  // 1. Caso Válido 1
  it('debe retornar nivel NORMAL cuando los signos vitales son completamente estables', () => {
    const res = evaluarAlerta({
      spo2: 98,
      ritmoCardiaco: 120,
      temperatura: 36.5,
    });
    expect(res.esAlerta).toBe(false);
    expect(res.nivel).toBe('NORMAL');
  });

  // 2. Caso Válido 2 (Advertencia)
  it('debe retornar nivel ADVERTENCIA cuando la frecuencia cardíaca se eleva moderadamente', () => {
    const res = evaluarAlerta({
      spo2: 95,
      ritmoCardiaco: 145,
      temperatura: 37.0,
    });
    expect(res.esAlerta).toBe(true);
    expect(res.nivel).toBe('ADVERTENCIA');
  });

  // 3. Caso Límite 1 (Umbral mínimo de SpO2)
  it('debe evaluar correctamente el límite inferior seguro de SpO2 (88%)', () => {
    const res = evaluarAlerta({
      spo2: 88,
      ritmoCardiaco: 120,
      temperatura: 36.5,
    });
    expect(res.esAlerta).toBe(true); // 88 exacto activa alerta de advertencia
  });

  // 4. Caso Límite 2 (Umbral superior de temperatura)
  it('debe disparar alerta CRITICA al superar el límite superior de temperatura (38.5°C)', () => {
    const res = evaluarAlerta({
      spo2: 96,
      ritmoCardiaco: 120,
      temperatura: 38.6,
    });
    expect(res.esAlerta).toBe(true);
    expect(res.nivel).toBe('CRITICO');
  });

  // 5. Caso de Error
  it('debe retornar un error controlado cuando faltan datos obligatorios', () => {
    // @ts-ignore
    const res = evaluarAlerta({
      spo2: null,
      ritmoCardiaco: undefined,
      temperatura: 36.5,
    } as any);
    expect(res.error).toBeDefined();
  });

  // 6. Prueba de Regresión (Paso 4 de la guía)
  it('REGRESION_01: debe manejar correctamente valores parciales evitando fallos de tipo en null', () => {
    const res = evaluarAlerta({});
    expect(res.error).toBe('Faltan parámetros requeridos');
  });
});