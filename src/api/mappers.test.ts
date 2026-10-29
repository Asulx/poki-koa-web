/**
 * @file mappers.test.ts
 * @description Pruebas unitarias de la traducción `snake_case` → `camelCase`
 * del contrato de la API.
 */

import { describe, expect, it } from 'vitest';

import {
  horaCorta,
  mapCuna,
  mapPaciente,
  mapPacientePayload,
  mapResumen,
  mapSerie,
  mapTurno,
} from './mappers';

describe('horaCorta', () => {
  it('recorta los segundos de una hora', () => {
    expect(horaCorta('07:00:00')).toBe('07:00');
  });

  it('conserva valores no reconocidos', () => {
    expect(horaCorta('')).toBe('');
  });
});

describe('mapTurno', () => {
  it('traduce el turno y sus horarios', () => {
    expect(
      mapTurno({
        id: 2,
        nombre: 'Tarde',
        hora_inicio: '15:00:00',
        hora_fin: '23:00:00',
        activo: true,
        duracion_horas: 8,
      })
    ).toEqual({
      id: 2,
      nombre: 'Tarde',
      horaInicio: '15:00',
      horaFin: '23:00',
      activo: true,
      duracionHoras: 8,
    });
  });

  it('considera activo por defecto y tolera campos ausentes', () => {
    const turno = mapTurno({});
    expect(turno.id).toBe(0);
    expect(turno.activo).toBe(true);
    expect(turno.nombre).toBe('');
  });
});

describe('mapPaciente', () => {
  it('normaliza identificadores, signos vitales y sexo', () => {
    const paciente = mapPaciente({
      id: 7,
      identificador: 'RN-007',
      nombre_completo: 'Lía Torres',
      edad_meses: 2,
      sexo: 'F',
      signos_vitales: {
        ritmo_cardiaco: 132,
        spo2: 97,
        temperatura: 36.7,
      },
    });

    expect(paciente.id).toBe(7);
    expect(paciente.sexo).toBe('F');
    expect(paciente.activo).toBe(true);
    expect(paciente.signosVitales).toEqual({
      ritmoCardiaco: 132,
      spo2: 97,
      temperatura: 36.7,
    });
    expect(paciente.medicamentos).toEqual([]);
    expect(paciente.alertas).toEqual([]);
  });

  it('trata cualquier sexo distinto de "M" como femenino', () => {
    expect(mapPaciente({ sexo: undefined }).sexo).toBe('F');
  });

  it('conserva los datos anidados de medicamentos y alertas', () => {
    const paciente = mapPaciente({
      medicamentos: [{ id: 1, nombre: 'Cafeína', dosis: '10 mg' }],
      alertas: [{ id: 4, mensaje: 'SpO₂ baja', nivel: 'Critica' }],
    });
    expect(paciente.medicamentos).toHaveLength(1);
    expect(paciente.medicamentos[0].nombre).toBe('Cafeína');
    expect(paciente.alertas[0].nivel).toBe('Critica');
  });
});

describe('mapPacientePayload', () => {
  it('traduce el formulario al contrato del backend', () => {
    const payload = mapPacientePayload({
      identificador: 'RN-010',
      nombreCompleto: 'Mateo Ríos',
      edadMeses: 1,
      edadGestacional: 37,
      sexo: 'M',
      peso: 2.9,
      fechaNacimiento: '2026-02-01',
      diagnostico: 'Prematuridad',
      observaciones: '',
      planCuidados: '',
      medicoACargo: 3,
    });

    expect(payload).toMatchObject({
      identificador: 'RN-010',
      nombre_completo: 'Mateo Ríos',
      edad_meses: 1,
      sexo: 'M',
      medico_a_cargo: 3,
    });
  });
});

describe('mapCuna', () => {
  it('deriva el estado y expone la telemetría', () => {
    const cuna = mapCuna({
      id: 1,
      identificador: 'C-01',
      estado: 'ocupada',
      paciente: 7,
      paciente_nombre: 'Lía Torres',
      ritmo_cardiaco: 140,
      tiene_alerta_critica: true,
      canula_ok: false,
    });

    expect(cuna.estado).toBe('ocupada');
    expect(cuna.pacienteId).toBe(7);
    expect(cuna.tieneAlertaCritica).toBe(true);
    expect(cuna.canulaOk).toBe(false);
  });

  it('usa "disponible" ante estados desconocidos', () => {
    expect(mapCuna({ estado: 'otro' }).estado).toBe('disponible');
  });
});

describe('mapResumen', () => {
  it('convierte todos los indicadores a camelCase', () => {
    const resumen = mapResumen({
      total_pacientes: 11,
      pacientes_activos: 8,
      cunas_ocupadas: 6,
      ocupacion_porcentaje: 55,
      alertas_criticas: 2,
      generado_en: '2026-03-15T12:00:00Z',
    });

    expect(resumen.totalPacientes).toBe(11);
    expect(resumen.pacientesActivos).toBe(8);
    expect(resumen.cunasOcupadas).toBe(6);
    expect(resumen.ocupacionPorcentaje).toBe(55);
    expect(resumen.alertasCriticas).toBe(2);
    expect(resumen.generadoEn).toBe('2026-03-15T12:00:00Z');
  });

  it('completa con ceros los indicadores ausentes', () => {
    const resumen = mapResumen({});
    expect(resumen.totalCunas).toBe(0);
    expect(resumen.alertasActivas).toBe(0);
  });
});

describe('mapSerie', () => {
  it('normaliza los puntos y usa la longitud como cantidad de días', () => {
    const serie = mapSerie({
      serie: [
        { fecha: '2026-03-14', ingresos: 2, alertas: 1 },
        { fecha: '2026-03-15', ingresos: 1, alertas: 0 },
      ],
    });

    expect(serie.dias).toBe(2);
    expect(serie.serie[0]).toEqual({
      fecha: '2026-03-14',
      ingresos: 2,
      alertas: 1,
    });
  });

  it('tolera una respuesta vacía', () => {
    expect(mapSerie({})).toEqual({ dias: 0, serie: [] });
  });
});
