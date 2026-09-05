import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Card from '@/components/ui/Card/Card'
import { useState } from 'react'
import Modal from '@/components/ui/Modal/Modal'
import Table from '@/components/ui/Table/Table'


export default function ComponentesDemoPage() {
  const [isModalOpen, setIsModalOpen] = 
    useState(false)

  return (
    <div>
      <h1>Componentes UI</h1>

      <Button variant="primary">
        Guardar
      </Button>

      <Button variant="secondary">
        Cancelar
      </Button>

      <Button disabled>
        Eliminar
      </Button>

      <Input
        label="Nombre"
        placeholder="Ingrese nombre"
       />

       <Input
        label="Correo"
        placeholder="correo@ejemplo.com"
        error="Correo inválido"
        />

       <Card title="Paciente">
        Información del paciente
       </Card>
       
       <button onClick={() => setIsModalOpen(true)}>
        Abrir Modal
       </button>

       <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
     >
        <h2>Modal</h2>
        <p>Contenido del modal</p>
      </Modal>

      <Table
        columns={['Nombre', 'Edad']}
        data={[
          {
            Nombre: 'Juan',
            Edad: 25,
          },
         {
          Nombre: 'María',
          Edad: 30,
         },
       ]}
      />
    </div>
  )
}