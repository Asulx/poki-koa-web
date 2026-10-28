import { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal/Modal';
import Table from '@/components/ui/Table/Table';

/**
 * Componente de página para la demostración y validación visual de los componentes de UI del sistema.
 * Agrupa botones, campos de entrada, tarjetas, modales y tablas bajo los estándares de diseño.
 * 
 * @returns Un elemento JSX con la vista de demostración de componentes UI.
 */
export default function ComponentesDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function abrirModal() {
    setIsModalOpen(true);
  }

  function cerrarModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      <h1>Componentes UI</h1>

      <Button variant="primary">Guardar</Button>
      <Button variant="secondary">Cancelar</Button>
      <Button disabled>Eliminar</Button>

      <Input label="Nombre" placeholder="Ingrese nombre" />

      <Input
        label="Correo"
        placeholder="correo@ejemplo.com"
        error="Correo inválido"
      />

      <Card title="Paciente">Información del paciente</Card>

      <button onClick={abrirModal}>Abrir Modal</button>

      <Modal isOpen={isModalOpen} onClose={cerrarModal}>
        <h2>Modal</h2>
        <p>Contenido del modal</p>
      </Modal>

      <Table
        columns={[
          { key: 'Nombre', label: 'Nombre' },
          { key: 'Edad', label: 'Edad' },
        ]}
        data={[
          { Nombre: 'Juan', Edad: 25 },
          { Nombre: 'María', Edad: 30 },
        ]}
      />
    </div>
  );
}