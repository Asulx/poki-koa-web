import Button from '@/components/ui/Button/Button'

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
    </div>
  )
}