import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Card from '@/components/ui/Card/Card'

export default function ComponentesDemoPage() {
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
    </div>
  )
}