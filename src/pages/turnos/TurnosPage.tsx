// Vista de jefatura: formulario para asignar + lista de asignaciones del día elegido.
import { useEffect, useState, type FormEvent } from "react";

import Button from "@/components/ui/Button/Button";
import Table, { type TableColumn } from "@/components/ui/Table/Table";
import {
  crearAsignacion,
  eliminarAsignacion,
  getAsignaciones,
  getCunas,
  getPersonal,
  getTurnos,
} from "@/services/turnosService";
import type { Asignacion, CunaResumen, Personal, Turno } from "@/types/turnos";
import { hoyISO } from "@/utils/fechas";

export default function TurnosPage() {
  const [fecha, setFecha] = useState(hoyISO());
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [cunas, setCunas] = useState<CunaResumen[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [form, setForm] = useState({ usuario: "", cuna: "", turno: "" });
  const [error, setError] = useState("");

  // Datos que casi no cambian: se cargan una sola vez
  useEffect(() => {
    Promise.all([getTurnos(), getPersonal(), getCunas()])
      .then(([t, p, c]) => {
        setTurnos(t);
        setPersonal(p);
        setCunas(c);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  // La lista de asignaciones se recarga cada vez que cambia la fecha
  useEffect(() => {
    getAsignaciones(fecha)
      .then(setAsignaciones)
      .catch((err: Error) => setError(err.message));
  }, [fecha]);

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await crearAsignacion({
        usuario: Number(form.usuario),
        cuna: Number(form.cuna),
        turno: Number(form.turno),
        fecha,
      });
      setAsignaciones(await getAsignaciones(fecha));
    } catch (err) {
      // Aquí llega, por ejemplo, el mensaje de "asignación duplicada" del backend
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  };

  const borrar = async (id: number) => {
    if (!window.confirm("¿Eliminar esta asignación?")) return;
    try {
      await eliminarAsignacion(id);
      setAsignaciones((actuales) => actuales.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  };

  const columnas: TableColumn<Asignacion>[] = [
    { key: "usuario_nombre", label: "Profesional" },
    { key: "cuna_identificador", label: "Cuna" },
    { key: "turno_nombre", label: "Turno" },
    {
      key: "acciones",
      label: "Acciones",
      render: (a) => (
        <Button variant="secondary" onClick={() => borrar(a.id)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div style={{ textAlign: "left" }}>
      <h1>Turnos y Asignación de Cunas</h1>

      <div>
        <label>Fecha </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <form onSubmit={guardar} style={{ marginTop: 16 }}>
        <select
          value={form.usuario}
          onChange={(e) => setForm({ ...form, usuario: e.target.value })}
        >
          <option value="">Profesional</option>
          {personal.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} ({p.rol})
            </option>
          ))}
        </select>

        <select
          value={form.cuna}
          onChange={(e) => setForm({ ...form, cuna: e.target.value })}
        >
          <option value="">Cuna</option>
          {cunas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.identificador}
            </option>
          ))}
        </select>

        <select
          value={form.turno}
          onChange={(e) => setForm({ ...form, turno: e.target.value })}
        >
          <option value="">Turno</option>
          {turnos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre} ({t.hora_inicio.slice(0, 5)}-{t.hora_fin.slice(0, 5)})
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!form.usuario || !form.cuna || !form.turno}
        >
          Asignar
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Table columns={columnas} data={asignaciones} rowKey={(a) => a.id} />
    </div>
  );
}
